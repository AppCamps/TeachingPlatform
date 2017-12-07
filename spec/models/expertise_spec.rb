# frozen_string_literal: true

require 'spec_helper'

describe Expertise do
  it { is_expected.to have_many(:expertise_lessons).dependent(:destroy) }
  it { is_expected.to have_many(:lessons).through(:expertise_lessons) }

  describe 'validations' do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(255) }
  end
end
