# frozen_string_literal: true

EnvVarNotFoundError = Class.new(KeyError)

# extends Object for global methods
class Object
  # add shorthand method for env requires with explicit error message
  def fetch_from_env(variable_name)
    ENV.fetch(variable_name.to_s)
  rescue KeyError
    raise EnvVarNotFoundError,
          "Environment Variable not found: #{variable_name}"
  end
end
