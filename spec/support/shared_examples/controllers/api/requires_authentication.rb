# frozen_string_literal: true

require 'spec_helper'

shared_examples('requires authentication') do
  before do
    raise 'You have to specify a action block' unless action
  end

  let(:login_user) { user || create(:user) }

  it 'raises error without user' do
    sign_out(:user)
    bypass_rescue
    expect { action.call }
      .to raise_error Api::ApiController::AuthenticationMissingError
  end

  it 'works with signed in user' do
    sign_in_user(login_user)

    expect { action.call }
      .not_to raise_error
  end
end
