# frozen_string_literal: true

require 'faker'

FactoryGirl.define do
  factory :course do
    topic

    title       { Faker::Lorem.words(4).join ' ' }
    description { Faker::Lorem.paragraph(3) }
    slug        { title.to_s.parameterize }

    trait :unpublished do
      after(:create) do |course|
        create(:lesson, :unpublished, course: course)
      end
    end

    trait :published do
      after(:create) do |course, _evaluator|
        create_list(:lesson, 1, course: course)
      end
    end

    trait :with_lessons do
      transient { lessons_count 3 }

      after(:create) do |course, evaluator|
        create_list(:lesson, evaluator.lessons_count, course: course)
      end
    end

    trait :with_certificate do
      certificate do
        file = Rails.root.join('spec', 'fixtures', 'test_image.png')
        Rack::Test::UploadedFile.new(file)
      end
    end
  end

  factory :invalid_course, parent: :course do
    title nil
  end
end
