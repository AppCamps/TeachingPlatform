# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

require_relative '../app/middleware/catch_json_parse_errors.rb'

module TeachingPlatform
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.load_defaults 5.0
    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
    config.middleware.use CatchJsonParseErrors
    config.middleware.use Rack::Attack

    if ENV['BASIC_AUTH']
      username, password = ENV['BASIC_AUTH'].split(':')
      config.middleware.use Rack::Auth::Basic do |u, p|
        [u, p] == [username, password]
      end
    end

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]
    config.i18n.available_locales = %i[de en]
    config.i18n.default_locale = :de
    config.assets.initialize_on_precompile = false
    config.assets.paths << Rails.root.join('app', 'assets', 'files')

    config.active_job.queue_adapter = :sucker_punch
  end
end
