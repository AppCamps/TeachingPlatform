# frozen_string_literal: true

require 'sucker_punch/async_syntax'

SuckerPunch.exception_handler = ->(ex, _klass, _args) { Rollbar.error(ex) }
