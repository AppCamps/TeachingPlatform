# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to sessions' do
  it 'routes /session to session#create' do
    assert_generates(
      '/api/session',
      controller: 'api/sessions',
      action: 'create'
    )
  end

  it 'routes /session to session#show' do
    assert_generates(
      '/api/session',
      controller: 'api/sessions',
      action: 'show'
    )
  end
end
