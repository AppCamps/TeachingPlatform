#!/bin/bash

# This script runs in docker container

bundle install

bundle exec rake db:seed RAILS_ENV=development
