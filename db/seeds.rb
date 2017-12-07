# frozen_string_literal: true

unless User.exists?(email: 'admin@appcamps.de')
  User.create!(
    admin: true,
    email: 'admin@appcamps.de',
    first_name: 'Armin',
    last_name: 'Admin',
    password: 'password123',
    password_confirmation: 'password123',
    role: :role_custom,
    role_custom: 'Admin',
    confirmed_at: Time.zone.now,
    privacy_policy_accepted_at: Time.zone.now
  )
end

unless User.exists?(email: 'hans@wurst.de')
  User.create!(
    admin: false,
    email: 'hans@wurst.de',
    first_name: 'Hans',
    last_name: 'Wurst',
    password: 'password123',
    password_confirmation: 'password123',
    role: :role_teacher,
    confirmed_at: Time.zone.now,
    privacy_policy_accepted_at: Time.zone.now
  )
end
