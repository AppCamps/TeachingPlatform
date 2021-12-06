FROM ruby:2.7.5

RUN apt-get update && apt-get install -y nodejs
RUN gem install bundler

# Pre-installation of dependencies in docker image (globals)
ADD ./Gemfile /prepare/Gemfile
WORKDIR /prepare
RUN bundle install

# Project directory
WORKDIR /workspace
ENTRYPOINT "/workspace/scripts/docker/docker-entrypoint.sh"
