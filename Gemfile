# frozen_string_literal: true

source 'https://rubygems.org'
ruby '2.7.6'

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
gem 'rack-attack'

gem 'active_model_serializers', '0.10.6'
gem 'jsonapi-parser'

gem 'countries'

gem 'aws-sdk-s3'

gem 'shrine', '3.4.0'

gem 'lograge'
gem 'passenger'

gem 'gibbon', '3.4.4'
gem 'mandrill_mailer'
gem 'rollbar'
gem 'sucker_punch'

# deprecated in rails, but devise is calling it without declaring a dependency...
gem 'erubis'

gem 'scout_apm'

gem 'blazer'

group :development, :test do
  gem 'bundler-audit'
  gem 'byebug'
  gem 'dotenv-rails'
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
  gem 'dalli'
  gem 'rails_12factor'
end
