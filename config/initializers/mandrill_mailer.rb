# frozen_string_literal: true

MandrillMailer.configure do |config|
  config.api_key = fetch_from_env('MANDRILL_API_KEY')
  config.deliver_later_queue_name = :mailer
end
