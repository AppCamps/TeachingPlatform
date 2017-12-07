# frozen_string_literal: true

require 'spec_helper'

describe ETL::Export do
  let(:mysql_double) { double }

  before do
    class TestModel; end
    class TestExport < ETL::Export
      klass 'TestModel'
      columns :id, :name

      drop_destination_table_sql do
        <<-SQL.squish
          DROP TABLE IF EXISTS tests
        SQL
      end

      destination_table_sql do
        <<-SQL.squish
          CREATE TABLE IF NOT EXISTS tests(
            id IN PRIMARY KEY NOT NULL,
            name VARCHAR(255)
          );
        SQL
      end

      insert_sql do |data|
        <<-SQL.squish
          INSERT INTO tests
            (id, name)
          VALUES
            (
              #{data[:id]},
              '#{data[:name]}'
            );
        SQL
      end
    end
  end

  after do
    ActiveSupport::Dependencies.remove_constant('TestModel')
    ActiveSupport::Dependencies.remove_constant('TestExport')
  end

  it 'initializes with client' do
    export = described_class.new(client: mysql_double)

    expect(export.client).to eql(mysql_double)
  end

  describe '#scope' do
    it 'uses klass ivar' do
      export = TestExport.new(client: mysql_double)
      expect(export.send(:scope)).to eql(TestModel)
    end

    it 'uses code given in scope block' do
      class TestExport
        scope do
          'asdasd'
        end
      end

      export = TestExport.new(client: mysql_double)
      expect(export.send(:scope)).to eql('asdasd')
    end
  end

  describe '#drop_table' do
    it 'does nothing when drop_destination_table_sql block is not present' do
      export = described_class.new(client: mysql_double)

      expect(mysql_double).not_to receive(:query)

      export.drop_table!
    end

    it 'executes drop_destination_table_sql' do
      export = TestExport.new(client: mysql_double)

      expect(mysql_double).to receive(:query).with('DROP TABLE IF EXISTS tests')

      export.drop_table!
    end
  end

  describe '#setup!' do
    it 'raises error destination_table_sql block is not existent' do
      export = described_class.new(client: mysql_double)

      expect { export.setup! }
        .to raise_error(ETL::Export::BlockUndefinedError, 'destination_table_sql')
    end

    it 'executes destination_table_sql' do
      export = TestExport.new(client: mysql_double)

      expect(mysql_double).to(
        receive(:query)
          .with(
            'CREATE TABLE IF NOT EXISTS tests( id IN PRIMARY KEY NOT NULL, name VARCHAR(255) );'
          )
      )

      export.setup!
    end
  end

  describe '#run!' do
    let(:record) { double }

    before do
      allow(TestModel).to receive(:find_in_batches) do |&block|
        block.call [record]
      end
    end

    it 'exports information from ActiveRecordModels, escapes strings and logs count' do
      export = TestExport.new(client: mysql_double)

      expect(record).to receive(:id).and_return(1)
      expect(record).to receive(:name).and_return("'; DROP DATABASE; '")

      expect(mysql_double).to receive(:escape).with("'; DROP DATABASE; '").and_return('Hans')
      expect(mysql_double)
        .to receive(:query).with("INSERT INTO tests (id, name) VALUES ( 1, 'Hans' );")

      expect(Rails.logger).to receive(:info).with('TestExport exported 1 records.')

      export.run!
    end

    it 'only exports columns given in self.columns' do # rubocop:disable RSpec/ExampleLength
      class TestExport
        columns :id

        insert_sql do |data|
          <<-SQL.squish
            INSERT INTO tests
              (id)
            VALUES
              ( #{data[:id]} );
          SQL
        end
      end

      expect(record).to receive(:id).and_return(1)
      expect(record).not_to receive(:name)

      expect(mysql_double)
        .to receive(:query).with('INSERT INTO tests (id) VALUES ( 1 );')

      export = TestExport.new(client: mysql_double)
      export.run!
    end

    it 'uses method named like column if it exists' do
      class TestExport
        def id
          234
        end
      end

      expect(record).not_to receive(:id)
      expect(record).to receive(:name).and_return('Hans')

      expect(mysql_double).to receive(:escape).with('Hans').and_return('Hans')
      expect(mysql_double)
        .to receive(:query).with("INSERT INTO tests (id, name) VALUES ( 234, 'Hans' );")

      export = TestExport.new(client: mysql_double)
      export.run!
    end

    it 'uses skips record if SkipRecordException is raised' do
      class TestExport
        def id
          raise SkipRecordException
        end
      end

      expect(record).not_to receive(:id)

      expect(mysql_double).not_to receive(:escape).with('Hans')
      expect(mysql_double).not_to receive(:query)

      export = TestExport.new(client: mysql_double)

      expect(Rails.logger).to receive(:info).with('TestExport exported 0 records.')

      export.run!
    end

    describe '#value_or_null' do
      let(:export) { described_class.new(client: nil) }

      it 'returns NULL for nil values' do
        expect(export.send(:value_or_null, nil)).to eql('NULL')
      end

      it 'returns number for integer values' do
        expect(export.send(:value_or_null, 45)).to be(45)
      end

      it 'returns escaped string for string values' do
        expect(export.send(:value_or_null, 'string')).to eql("'string'")
      end
    end

    describe '#value_or_not_present' do
      let(:export) { described_class.new(client: nil) }

      it 'returns "keine Angabe" for nil values' do
        expect(export.send(:value_or_not_present, nil)).to eql("'keine Angabe'")
      end

      it 'returns "number" for integer values' do
        expect(export.send(:value_or_not_present, 45)).to eql("'45'")
      end

      it 'returns escaped string for string values' do
        expect(export.send(:value_or_not_present, 'string')).to eql("'string'")
      end
    end
  end
end
