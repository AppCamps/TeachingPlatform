# frozen_string_literal: true

require 'faker'

FactoryBot.define do
  factory :school_class do
    user

    resource_type { SchoolClass::SCHOOL_CLASS }
    girl_count { Faker::Number.between(from: 1, to: 23) }
    boy_count { Faker::Number.between(from: 1, to: 23) }

    courses { create_list(:course, 2, :with_lessons) }

    trait :class do
      class_name { Faker::Space.star }
      school_year { '2016 / 2017' }
      grade { '7' }
      school_subject { 'computer science' }
      planned_school_usage do
        index =
          Faker::Number.between(from: 0, to: SchoolClass::PLANNED_SCHOOL_USAGE.length - 1)

        SchoolClass::PLANNED_SCHOOL_USAGE.dup[index]
      end
    end

    trait :group do
      resource_type { SchoolClass::EXTRACURRICULAR }
      group_name { Faker::Space.star }
      year { '2017' }
      age { '7-23' }
      planned_extracurricular_usage do
        Faker::Lorem.paragraph
      end
    end
  end
end
