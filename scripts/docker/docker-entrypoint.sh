#!/bin/bash

# This script runs in docker container

bundle install

# bundle exec rake db:setup
# RAILS_ENV=test bundle exec rake db:setup

# bundle exec rspec

bundle exec rails s -b 0.0.0.0 && echo 'Listening on http://<hostname>:3000'
