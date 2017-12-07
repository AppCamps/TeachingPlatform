# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to courses' do
  it 'routes /courses to courses#index' do
    assert_generates(
      '/api/courses',
      controller: 'api/courses',
      action: 'index'
    )
  end
end
