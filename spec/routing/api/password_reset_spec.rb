# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to school_classes' do
  it 'routes /password-reset to password_reset#create' do
    assert_generates(
      '/api/password-reset',
      controller: 'api/password_reset',
      action: 'create'
    )
  end

  it 'routes /password-reset/:reset_password_token to school_classes#update' do
    token = SecureRandom.uuid
    assert_generates(
      "/api/password-reset/#{token}",
      controller: 'api/password_reset',
      action: 'update',
      reset_password_token: token
    )
  end
end
