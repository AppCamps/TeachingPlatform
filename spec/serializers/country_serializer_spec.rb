# frozen_string_literal: true

require 'spec_helper'

describe CountrySerializer do
  let(:country) { CountryService.new(:DEU) }
  let(:serializer_instance) do
    described_class.new(country)
  end

  %i[
    name
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash[attribute_name])
        .to eql(country.send(attribute_name.to_sym))
    end
  end

  it 'code' do
    expect(serializer_instance.serializable_hash[:code]).to eql(country.alpha3)
  end

  it 'states' do
    expect(serializer_instance.serializable_hash[:states])
      .to eql(country.states.try(:transform_keys, &:downcase))
  end

  it 'postal_code_format' do
    expect(country).to receive(:postal_code_format).and_return(/[A-z0-9]{4}/)

    expect(serializer_instance.serializable_hash[:postal_code_format])
      .to eql('/[A-z0-9]{4}/')
  end
end
