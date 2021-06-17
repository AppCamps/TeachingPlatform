# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :topic do
    title { Faker::Company.buzzword }
    color { Faker::Color.hex_color[1...7] }
    light_color { Faker::Color.hex_color[1...7] }
    sequence(:slug) { |n| "some_slug_#{n}" }

    icon do
      file = Rails.root.join('spec', 'fixtures', 'test_image.png')
      Rack::Test::UploadedFile.new(file)
    end
  end
end
