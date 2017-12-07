# frozen_string_literal: true

require 'spec_helper'

describe CommonMistake do
  describe 'associations' do
    it { is_expected.to have_many(:lessons).through(:common_mistake_lessons) }
    it { is_expected.to have_many(:common_mistake_lessons).dependent(:destroy) }
  end

  describe 'validations' do
    describe 'validations' do
      %i[problem solution].each do |attribute|
        it { is_expected.to validate_presence_of(attribute) }
      end

      it { is_expected.to validate_length_of(:problem).is_at_most(255) }
    end
  end
end
