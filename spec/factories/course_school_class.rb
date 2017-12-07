# frozen_string_literal: true

FactoryGirl.define do
  factory :course_school_class do
    course
    school_class { build(:school_class, :class) }

    certificate_downloaded false

    trait :certificate_downloaded do
      certificate_downloaded true
    end
  end
end
