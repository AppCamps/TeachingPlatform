# frozen_string_literal: true

require 'spec_helper'

describe ExpertiseLesson do
  it { is_expected.to belong_to(:expertise) }
  it { is_expected.to belong_to(:lesson).touch(true) }
end
