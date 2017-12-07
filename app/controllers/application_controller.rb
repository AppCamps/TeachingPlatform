# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  after_action :set_xsrf_token_cookie

  def set_xsrf_token_cookie
    cookies['XSRF-TOKEN'] = form_authenticity_token
  end
end
