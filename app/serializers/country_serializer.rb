# frozen_string_literal: true

class CountrySerializer < BaseSerializer
  type :countries

  attributes :code, :value, :states, :name, :postal_code_format

  def postal_code_format
    object.postal_code_format.inspect
  end

  def states
    # downcase keys so active-model-serializer won't dasherize the state codes
    object.states.try(:transform_keys, &:downcase)
  end

  def code
    object.alpha3
  end

  def value
    object.alpha3
  end
end
