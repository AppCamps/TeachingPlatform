# frozen_string_literal: true

require 'faker'

FactoryGirl.define do
  factory :expertise do
    title { Faker::Shakespeare.hamlet_quote }
  end
end
