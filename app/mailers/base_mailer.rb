# frozen_string_literal: true

class BaseMailer < MandrillMailer::TemplateMailer
  default from: fetch_from_env('FROM_EMAIL')
  default from_name: 'App Camps'
end
