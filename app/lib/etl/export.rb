# frozen_string_literal: true

module ETL
  class Export
    BlockUndefinedError = Class.new(StandardError)
    SkipRecordException = Class.new(StandardError)

    class << self
      attr_accessor :attributes_name
      attr_writer :klass, :scope

      def klass(class_name)
        @klass = class_name.constantize
      end

      def scope(&block)
        @scope = block
      end

      def columns(*column_names)
        @columns = column_names.map(&:to_sym)
      end

      def drop_destination_table_sql(&block)
        @drop_destination_table_sql = block
      end

      def destination_table_sql(&block)
        @destination_table_sql = block
      end

      def insert_sql(&block)
        @insert_sql = block
      end
    end

    attr_reader :client, :source

    def initialize(client:)
      @client = client
    end

    def setup!
      sql = instance_exec(&class_instance_variable('destination_table_sql', raise_error: true))
      client.query(sql)
    end

    def drop_table!
      block = class_instance_variable('drop_destination_table_sql')
      return unless block

      sql = instance_exec(&block)
      client.query(sql)
    end

    def run! # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      count = 0
      scope.find_in_batches do |batch|
        count += batch.size
        batch.each do |record|
          @source = record
          begin
            data = class_instance_variable('columns').each_with_object({}) do |column, memo|
              value = respond_to?(column) ? send(column) : record.send(column)
              value = client.escape(value) if value.is_a?(String)
              memo[column] = value
            end
            insert_block = class_instance_variable('insert_sql', raise_error: true)
            sql = instance_exec(data, &insert_block)
            client.query(sql)
          rescue SkipRecordException
            count -= 1
            next
          end
        end
      end

      Rails.logger.info("#{self.class} exported #{count} records.")
    end

    protected

    def value_or_null(value)
      if value.present?
        return "'#{value}'" if value.is_a?(String)
        return value
      end
      'NULL'
    end

    def value_or_not_present(value)
      return "'#{value}'" if value.present?
      "'keine Angabe'"
    end

    def skip_record!
      raise SkipRecordException
    end

    private

    def scope
      if class_instance_variable('scope').present?
        return instance_exec(&class_instance_variable('scope'))
      end
      class_instance_variable('klass')
    end

    def class_instance_variable(variable_name, raise_error: false)
      result = self.class.instance_variable_get("@#{variable_name}")
      raise(BlockUndefinedError, variable_name) if raise_error && result.nil?

      result
    end
  end
end
