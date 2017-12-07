# frozen_string_literal: true

require 'spec_helper'

describe PreparationMaterial do
  describe 'relations' do
    it { is_expected.to belong_to(:topic).touch(true) }
  end

  describe 'validations' do
    presence_validation_attributes =
      %i[medium_type title link icon]
    presence_validation_attributes.each do |attribute|
      it { is_expected.to validate_presence_of(attribute) }
    end

    length_validation_attributes =
      %i[title subtitle link icon]
    length_validation_attributes.each do |attribute|
      it { is_expected.to validate_length_of(attribute).is_at_most(255) }
    end
  end

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:medium_type).with(
        medium_type_video: 0,
        medium_type_document: 1,
        medium_type_link: 2,
        medium_type_other: 3
      )
    end
  end
end
