# frozen_string_literal: true

require 'lograge'

Rails.application.config do |config|
  # add time to lograge
  config.lograge.custom_options = lambda do |event|
    {
      time: event.time
    }
  end

  config.lograge.custom_payload do |controller|
    {
      user_id: controller.current_user.try(:id)
    }
  end
end
