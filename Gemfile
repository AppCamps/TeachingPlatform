# frozen_string_literal: true

source 'https://rubygems.org'
ruby '2.6.7'

gem 'rails', '~> 5.1.6'
gem 'rails-i18n', '~> 5.0.0'

gem 'migration_data'
gem 'pg'

# user for data export
gem 'mysql2', '~> 0.4.10'

gem 'bootstrap-sass'
gem 'font-awesome-sass'
gem 'sass-rails'
gem 'uglifier'

gem 'bootstrap-wysihtml5-rails', '> 0.3.1.24'
gem 'rails_admin'
gem 'rails_admin-i18n'

gem 'devise'
gem 'rack-attack'

gem 'active_model_serializers'
gem 'jsonapi-parser'

gem 'countries'

gem 'aws-sdk-s3'
gem 'shrine'

gem 'lograge'
gem 'passenger'

gem 'gibbon'
gem 'mandrill_mailer'
gem 'rollbar'
gem 'sucker_punch'

# deprecated in rails, but devise is calling it without declaring a dependency...
gem 'erubis'

# thredded + dependencies
gem 'kaminari-i18n'
gem 'thredded',
    git: 'https://github.com/AppCamps/thredded.git',
    branch: 'german-locales'
gem 'thredded-markdown_coderay'

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
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'puma'
  gem 'rspec-collection_matchers'
  gem 'rspec-rails'
  gem 'shoulda-matchers',
      git: 'https://github.com/thoughtbot/shoulda-matchers.git',
      branch: 'rails-5'
  gem 'simplecov', require: false
  gem 'timecop'
  gem 'webmock'
end

group :production do
  gem 'dalli'
  gem 'rails_12factor'
end
