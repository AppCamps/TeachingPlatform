# frozen_string_literal: true

desc 'turn on synchronous error reporting'
task synchronous_error_reporting: :environment do
  Rollbar.configure do |config|
    config.use_async = false
  end
  Rails.logger.info('Rollbar is configured to send errors synchronously')
end
