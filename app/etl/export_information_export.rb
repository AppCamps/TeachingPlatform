# frozen_string_literal: true

class ExportInformationExport < ETL::Export
  class ExportInformation
    def self.find_in_batches
      yield [OpenStruct.new(export_ran_at: Time.zone.now)]
    end
  end

  scope do
    ExportInformation
  end

  destination_table_sql do
    <<-SQL.squish
      CREATE TABLE IF NOT EXISTS export_informations (
        id VARCHAR(36) PRIMARY KEY,
        export_ran_at DATETIME NOT NULL
      );
    SQL
  end

  insert_sql do |data|
    <<-SQL.squish
      INSERT INTO export_informations
        (id, export_ran_at)
      VALUES
        (
          uuid(),
          '#{data[:export_ran_at]}'
        );
    SQL
  end

  columns :export_ran_at

  def export_ran_at
    source.export_ran_at.to_s(:db)
  end
end
