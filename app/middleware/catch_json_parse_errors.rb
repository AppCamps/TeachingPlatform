# frozen_string_literal: true

class CatchJsonParseErrors
  def initialize(app)
    @app = app
  end

  def call(env)
    @app.call(env)
  rescue ActionDispatch::Http::Parameters::ParseError => exception
    raise error unless env['CONTENT_TYPE'].match?(%r{application\/vnd\.api\+json})

    # raise error with shortened message (because body is included and
    # potentially leaks sensitive data)
    error = ActionDispatch::Http::Parameters::ParseError.new(exception.message[0..20], exception)
    Rollbar.error(error)

    error_response = {
      errors: [{ detail: 'Malformed JSON' }]
    }
    [400, { 'Content-Type' => 'application/vnd+json' }, [JSON.generate(error_response)]]
  end
end
