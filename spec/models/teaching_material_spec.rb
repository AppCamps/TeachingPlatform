# frozen_string_literal: true

require 'spec_helper'

describe TeachingMaterial do
  describe 'relations' do
    it { is_expected.to belong_to(:lesson) }
  end

  describe 'validations' do
    presence_validation_attributes =
      %i[title medium_type link]
    presence_validation_attributes.each do |attribute|
      it { is_expected.to validate_presence_of(attribute) }
    end

    length_validation_attributes =
      %i[title subtitle link link listing_title listing_icon]
    length_validation_attributes.each do |attribute|
      it { is_expected.to validate_length_of(attribute).is_at_most(255) }
    end
  end

  describe 'image' do
    it 'includes TeachingMaterialUploader[:image]' do
      expect(described_class.included_modules.map(&:name))
        .to include(TeachingMaterialUploader[:image].name)
    end
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:medium_type).with(
        medium_type_video: 0,
        medium_type_other: 1
      )
    end
  end
end
