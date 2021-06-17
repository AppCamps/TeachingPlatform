# frozen_string_literal: true

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false
  config.action_controller.action_on_unpermitted_parameters = :raise

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load
  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  config.action_mailer.default_url_options = { host: 'localhost:3000' }
  config.action_mailer.smtp_settings = {
    address:        'smtp.mandrillapp.com',
    port:           587,
    domain:         fetch_from_env('DOMAIN'),
    user_name:      fetch_from_env('MANDRILL_USER'),
    password:       fetch_from_env('MANDRILL_API_KEY')
  }
  config.action_mailer.delivery_method = :smtp

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  config.generators do |g|
    # Use an evented file watcher to asynchronously detect changes in source code,
    # routes, locales, etc. This feature depends on the listen gem.
    g.file_watcher = ActiveSupport::EventedFileUpdateChecker
    g.orm :active_record, primary_key_type: :uuid
    g.test_framework :rspec,
                     fixtures: true,
                     view_specs: false,
                     helper_specs: false,
                     routing_specs: true,
                     controller_specs: true,
                     request_specs: true
    g.fixture_replacement :factory_girl, dir: 'spec/factories'
  end

   # Enable/disable caching. By default caching is disabled.
   # Run rails dev:cache to toggle caching.
   if Rails.root.join('tmp', 'caching-dev.txt').exist?
     config.action_controller.perform_caching = true
 
     config.cache_store = :memory_store
     config.public_file_server.headers = {
       'Cache-Control' => "public, max-age=172800"
     }
   else
     config.action_controller.perform_caching = false
     config.cache_store = :null_store
   end

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true
  config.ssl_options = { hsts: { subdomains: true } }
end
