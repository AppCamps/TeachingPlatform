# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to posts' do
  it 'routes /posts to posts#index' do
    assert_generates(
      '/api/posts',
      controller: 'api/posts',
      action: 'index'
    )
  end
end
