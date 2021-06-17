# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :common_mistake do
    problem     { Faker::Lorem.words(number: 4).join ' ' }
    solution    { Faker::Lorem.paragraph(sentence_count: 3) }
  end
end
