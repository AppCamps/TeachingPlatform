# frozen_string_literal: true

class RedirectFailureApp < Devise::FailureApp
  def redirect_url
    TeachUrl.login(request.original_url)
  end

  def respond
    if http_auth?
      http_auth
    else
      redirect_to redirect_url
    end
  end
end
