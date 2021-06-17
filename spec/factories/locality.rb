# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :locality do
    school_name do
      Faker::Educator.university if user&.role_teacher?
    end
    school_type do
      if user&.role_teacher?
        school_types = Locality.school_types.keys
        school_types[SecureRandom.random_number(school_types.length - 1)]
      end
    end
    school_type_custom do
      'Werkrealschule' if school_type.try(:to_sym) == :school_type_custom
    end

    postal_code do
      postcode = Faker::Address.postcode
      country.in?(%i[AUT CHE]) ? postcode[0..3] : postcode
    end
    city { Faker::Address.city }
    country do
      countries = CountryService.codes
      countries[SecureRandom.random_number(countries.length - 1)]
    end

    state do
      states = CountryService.find(country).states.keys
      states[rand(SecureRandom.random_number(states.length - 1))] if states.any?
    end
  end
end
