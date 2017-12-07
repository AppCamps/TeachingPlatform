# frozen_string_literal: true

require 'faker'

FactoryGirl.define do
  factory :common_mistake do
    problem     { Faker::Lorem.words(4).join ' ' }
    solution    { Faker::Lorem.paragraph(3) }
  end
end
