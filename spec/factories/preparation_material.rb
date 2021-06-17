# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :preparation_material do
    topic

    sequence(:position)

    title     { Faker::Lorem.words(number: 6).join ' ' }
    subtitle  { Faker::Lorem.words(number: 6).join ' ' }
    link      { Faker::Internet.url }
    published { true }

    medium_type do
      medium_types = PreparationMaterial.medium_types.keys
      medium_types[rand(medium_types.length - 1)]
    end

    icon do
      case medium_type.to_sym
      when :medium_type_video
        'play'
      when :medium_type_document
        'file-o-pdf'
      when :medium_type_link
        'link'
      else
        'question'
      end
    end

    trait :unpublished do
      published { false }
    end
  end
end
