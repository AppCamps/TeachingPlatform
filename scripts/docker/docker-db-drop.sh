#!/bin/bash

# This script runs in docker container

bundle install

bundle exec rake db:drop RAILS_ENV=development
