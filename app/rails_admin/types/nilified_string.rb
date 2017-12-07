# frozen_string_literal: true

module Types
  class NilifiedString < RailsAdmin::Config::Fields::Types::String
    def parse_input(params)
      input = params[name]
      params[name] = input.present? ? super : nil
    end
  end
end
