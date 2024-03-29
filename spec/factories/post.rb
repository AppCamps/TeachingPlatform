# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :post do
    title { Faker::Lorem.words(number: 4).join ' ' }
    content { Faker::Lorem.paragraph(sentence_count: 3) }
    released_at { Time.zone.now }

    trait :with_teaser_image do
      teaser_image do
        file = Rails.root.join('spec', 'fixtures', 'test_image.png')
        Rack::Test::UploadedFile.new(file)
      end
    end
  end
end
