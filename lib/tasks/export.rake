# frozen_string_literal: true

def mysql_client # rubocop:disable Metrics/MethodLength
  Mysql2::Client.new(
    host: ENV.fetch('MYSQL_HOST'),
    database: ENV.fetch('MYSQL_DATABASE'),
    username: ENV.fetch('MYSQL_USERNAME'),
    password: ENV.fetch('MYSQL_PASSWORD'),
    sslkey: './certs/mysql/client-key.pem',
    sslcert: './certs/mysql/client-cert.pem',
    sslca: './certs/mysql/server-ca.pem',
    ssl_mode: :verify_ca,
    reconnect: true
  )
end

namespace :export do
  desc 'Run data extraction to mysql'
  task run: :environment do
    begin
      ETL::Runner.new(
        [
          ExportInformationExport,
          UserExport,
          CourseExport,
          SchoolClassExport,
          CourseSchoolClassExport
        ],
        client: mysql_client
      ).run
    end
  end
end

Rake::Task['export:run'].enhance [:synchronous_error_reporting]
