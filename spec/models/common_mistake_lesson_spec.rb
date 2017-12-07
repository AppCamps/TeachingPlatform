# frozen_string_literal: true

require 'spec_helper'

describe CommonMistakeLesson do
  describe 'associations' do
    it { is_expected.to belong_to(:lesson).touch(true) }
    it { is_expected.to belong_to(:common_mistake) }
  end
end
