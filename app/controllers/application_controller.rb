# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :redirect_to_fobizz
  after_action :set_xsrf_token_cookie

  def set_xsrf_token_cookie
    cookies['XSRF-TOKEN'] = form_authenticity_token
  end

  def redirect_to_fobizz
    redirect_to(fetch_from_env('TEACH_URL'), status: 301)
  end
end
