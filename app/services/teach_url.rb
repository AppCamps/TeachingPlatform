# frozen_string_literal: true

class TeachUrl
  InvalidArgumentTypeError = Class.new(ArgumentError)
  TEACH_URL = fetch_from_env('TEACH_URL')

  def self.root_url
    TEACH_URL
  end

  def self.login(redirect_url)
    escaped_redirect_url = CGI.escape(redirect_url)
    URI.join(TEACH_URL, 'login', "?redirect=#{escaped_redirect_url}").to_s
  end

  def self.logout
    URI.join(TEACH_URL, 'logout').to_s
  end

  def self.confirmation_url(confirmation_token)
    ensure_string(:confirmation_token, confirmation_token)

    URI.join(TEACH_URL, 'email-confirmation/', confirmation_token).to_s
  end

  def self.registration_url
    URI.join(TEACH_URL, 'registration').to_s
  end

  def self.password_reset_request_url
    URI.join(TEACH_URL, 'password-reset').to_s
  end

  def self.password_reset_url(password_reset_token)
    ensure_string(:password_reset_token, password_reset_token)

    URI.join(TEACH_URL, 'password-reset/', password_reset_token).to_s
  end

  def self.ensure_string(name, value)
    return if value.is_a?(String)

    raise InvalidArgumentTypeError,
          "#{name}: #{value} is not a string"
  end
end
