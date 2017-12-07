# frozen_string_literal: true

require 'spec_helper'

describe Api::Concerns::Filterable do
  FilterableClass = Struct.new('Filterable', :params) do
    include Api::Concerns::Filterable # rubocop:disable RSpec/DescribedClass
  end

  it 'creates a filter hash for unnested filters' do
    test_instance = FilterableClass.new(filter: { name: 'value' })
    expect(test_instance.filters).to eql(name: 'value')
  end

  it 'creates a filter hash for nested filters' do
    test_instance = FilterableClass.new(filter: { 'space.category' => 'deep' })
    expect(test_instance.filters).to eql(space: { category: 'deep' })
  end
end
