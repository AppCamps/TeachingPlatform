# frozen_string_literal: true

source 'https://rubygems.org'
ruby '2.7.8'

gem 'rails', '5.2.8.1'
gem 'rails-i18n', '5.1.3'

gem 'migration_data'
gem 'pg'

# user for data export
gem 'mysql2', '0.5.5'

gem 'bootstrap-sass', '3.4.1'
gem 'font-awesome-sass', '6.5.1'
gem 'sass-rails', '6.0.0'
gem 'uglifier', '4.2.0'

gem 'bootstrap-wysihtml5-rails', '0.3.3.8'
gem 'rails_admin', '2.1.1'
gem 'rails_admin-i18n'

gem 'devise', '4.9.3'
gem 'rack-attack', '6.7.0'

gem 'active_model_serializers', '0.10.6'
gem 'jsonapi-parser', '0.1.1'

gem 'countries', '5.7.1'

gem 'aws-sdk-s3', '1.142.0'

gem 'shrine', '3.5.0'

gem 'lograge', '0.14.0'
gem 'passenger', '6.0.19'

gem 'gibbon', '3.4.4'
gem 'mandrill_mailer', '1.8.0'
gem 'rollbar', '3.5.0'
gem 'sucker_punch', '3.2.0'

# deprecated in rails, but devise is calling it without declaring a dependency...
gem 'erubis','2.7.0'

gem 'scout_apm', '5.3.5'

gem 'blazer', '2.6.5'

group :development, :test do
  gem 'bundler-audit', '0.9.1'
  gem 'byebug', '11.1.3'
  gem 'dotenv-rails', '2.8.1'
  gem 'rubocop-rails_config'
  gem 'rubocop-rspec'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'pry-remote'
end

group :test do
  gem 'capybara', '>= 2.4.0'
  gem 'database_cleaner'
  gem "factory_bot_rails"
  gem 'faker'
  gem 'puma', '5.6.5'
  gem 'rspec-collection_matchers'
  gem 'rspec-rails'
  gem 'shoulda-matchers', '3.1.3'
  gem 'simplecov', require: false
  gem 'timecop'
  gem 'webmock'
end

group :production do
  gem 'dalli', '2.7.11'
  gem 'rails_12factor', '0.0.3'
end
