# frozen_string_literal: true

if ENV['COVERAGE']
  require 'simplecov'
  SimpleCov.start 'rails'
end

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
require 'rspec/rails'
require 'mandrill_mailer/offline'
require 'sucker_punch/testing/inline'
require 'webmock/rspec'

ActiveRecord::Migration.maintain_test_schema!
WebMock.disable_net_connect!(allow: '127.0.0.1')

Timecop.safe_mode = true

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

RSpec.configure do |config|
  config.profile_examples = ENV['RSPEC_PROFILE_EXAMPLES'] || false

  config.include FactoryGirl::Syntax::Methods
  config.include ActiveJob::TestHelper
  config.infer_spec_type_from_file_location!
  config.use_transactional_fixtures = false

  config.order = 'random'

  config.infer_base_class_for_anonymous_controllers = false

  config.include Devise::Test::ControllerHelpers, type: :controller

  Dir[Rails.root.join('spec', 'support', '**', '*.rb')].each do |file|
    require file
  end

  config.include Devise::Test::IntegrationHelpers, type: :feature
  config.include Support::Controller::Api::ContentType,
                 type: :controller,
                 api: true

  config.extend Support::MigrationHelpers, type: :migration
  config.extend Support::Controller::Api::Authorization,
                type: :controller,
                api: :authenticate

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before do
    DatabaseCleaner.strategy = :transaction
  end

  config.before(:each, type: :feature) do
    DatabaseCleaner.strategy = :truncation
  end

  config.around(:each, type: :migration) do |spec|
    spec.run
    DatabaseCleaner.clean_with :truncation
  end

  config.before do
    DatabaseCleaner.start
  end

  config.append_after do
    DatabaseCleaner.clean
  end

  config.after(:suite) do
    upload_dir = Rails.root.join('public', 'uploads')
    FileUtils.rm_rf(upload_dir)
  end
end
