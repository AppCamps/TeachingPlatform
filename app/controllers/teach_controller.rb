# frozen_string_literal: true

class TeachController < ApplicationController
  after_action :set_xsrf_token_cookie
  skip_before_action :verify_authenticity_token

  def render_app
    respond_to do |format|
      format.html { render file: "#{Rails.root}/app/views/teach/index.html", layout: false }
      format.all { head :not_found }
    end
  end
end
