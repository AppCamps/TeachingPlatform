# frozen_string_literal: true

Rollbar.configure do |config|
  if Rails.env.test? || Rails.env.development?
    config.enabled = false
  else
    config.access_token = fetch_from_env('ROLLBAR_ACCESS_TOKEN')
  end

  config.user_ip_obfuscator_secret = "don't show the ip!"
  config.scrub_headers |= ['authorization']

  config.use_sucker_punch

  # Enable delayed reporting (using Sidekiq)
  # config.use_sidekiq
  # You can supply custom Sidekiq options:
  # config.use_sidekiq 'queue' => 'default'

  # If you run your staging application instance in production environment then
  # you'll want to override the environment reported by `Rails.env` with an
  # environment variable like this: `ROLLBAR_ENV=staging`. This is a recommended
  # setup for Heroku. See:
  # https://devcenter.heroku.com/articles/deploying-to-a-custom-rails-environment
  config.environment = ENV['ROLLBAR_ENV'] || Rails.env
end
