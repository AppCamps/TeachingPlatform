# frozen_string_literal: true

module ETL
  class Runner
    def initialize(exports, client:)
      @exports = exports
      @client = client
    end

    def run # rubocop:disable Metrics/MethodLength
      exporters = @exports.map do |exporter_klass|
        exporter_klass.new(client: @client)
      end
      exporters.reverse.each(&:drop_table!)
      exporters.each(&:setup!)
      @client.query('START TRANSACTION')
      begin
        exporters.each do |exporter|
          Rails.logger.info "Running #{exporter.class}"
          exporter.run!
        end
        @client.query('COMMIT')
      rescue # rubocop:disable Lint/RescueWithoutErrorClass
        @client.query('ROLLBACK')
        raise
      end
    end
  end
end
