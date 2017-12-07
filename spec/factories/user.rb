# frozen_string_literal: true

require 'faker'

FactoryGirl.define do
  factory :user do
    first_name            { Faker::Name.first_name }
    last_name             { Faker::Name.last_name }

    role do
      roles = User.roles.keys
      roles[rand(roles.length - 1)]
    end

    role_custom do
      'Multiplikator' if role.to_sym == :role_custom
    end

    email { Faker::Internet.email }
    password { Faker::Internet.password(10, 20, true, true) }
    confirmed_at { 1.day.ago }
    privacy_policy_accepted true

    trait :with_locality do
      after_create do |user|
        user.current_locality = create(:locality)
      end
    end

    trait :admin do
      admin true
    end

    trait :beta do
      beta true
    end

    trait :with_password_confirmation do
      password_confirmation { password }
    end

    trait :with_referal do
      referal { Faker::Hipster.paragraph }
    end

    trait :unconfirmed do
      confirmed_at nil
    end

    trait :without_accepted_privacy_policy do
      privacy_policy_accepted_at nil
    end

    factory :admin, traits: [:admin]
    factory :user_registration, traits: %i[with_password_confirmation with_referal]
  end
end
