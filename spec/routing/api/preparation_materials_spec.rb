# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to preparation_materials' do
  it 'routes /preparation_materials to preparation_materials#index' do
    assert_generates(
      '/api/preparation_materials',
      controller: 'api/preparation_materials',
      action: 'index'
    )
  end
end
