# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :teaching_material do
    lesson

    title         { Faker::Lorem.words(number: 6).join ' ' }
    subtitle      { Faker::Lorem.words(number: 6).join ' ' }
    sequence(:position)
    link          { Faker::Internet.url }
    listing_title { Faker::Lorem.words(number: 6).join ' ' }
    listing_icon  { 'paperclip' }

    image do
      file = Rails.root.join('spec', 'fixtures', 'test_image.png')
      Rack::Test::UploadedFile.new(file)
    end

    medium_type do
      medium_types = TeachingMaterial.medium_types.keys
      medium_types[rand(medium_types.length - 1)]
    end

    lesson_content do
      medium_type.to_sym == :medium_type_video
    end
  end
end
