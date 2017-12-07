# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to sessions' do
  it 'routes /locality to locality#create' do
    assert_generates(
      '/api/locality',
      controller: 'api/localities',
      action: 'create'
    )
  end
end
