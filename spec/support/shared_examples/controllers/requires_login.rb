# frozen_string_literal: true

require 'spec_helper'

shared_examples 'requires logged in user' do
  before do
    sign_out :user

    raise 'You need to specify a logged_in user' unless user
    raise 'You have to specify a action block' unless action
  end

  it 'requires a logged in user' do
    action.call

    # TODO: use right url
    expect(response.redirect_url).to start_with(TeachUrl.login('http://test.host/unauthenticated'))
  end

  it 'requires a user' do
    sign_in user

    action.call

    expect(response).not_to have_http_status(301)
    expect(response).not_to be_forbidden
  end
end
