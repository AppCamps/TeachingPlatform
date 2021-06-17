# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :lesson do
    course
    title       { Faker::Lorem.words(number: 6).join ' ' }
    description { Faker::Lorem.paragraph(sentence_count: 3) }

    published { true }

    transient { teaching_materials_count { 2 } }
    transient { common_mistakes_count { 2 } }

    trait :unpublished do
      published { false }
    end

    after(:build) do |lesson, evaluator|
      lesson.teaching_materials << build_list(
        :teaching_material, evaluator.teaching_materials_count,
        lesson: lesson
      )
      lesson.common_mistakes << build_list(
        :common_mistake, evaluator.common_mistakes_count
      )
      lesson.expertises << build(:expertise)
    end
  end
end
