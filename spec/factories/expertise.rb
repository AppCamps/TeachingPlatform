# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :expertise do
    title { Faker::Quotes::Shakespeare.hamlet_quote }
  end
end
