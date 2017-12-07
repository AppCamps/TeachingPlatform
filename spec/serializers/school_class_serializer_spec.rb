# frozen_string_literal: true

require 'spec_helper'

describe SchoolClassSerializer do
  let(:school_class) { build(:school_class) }
  let(:serializer_instance) do
    described_class.new(school_class)
  end

  describe 'resource-type' do
    it 'serializes resource_type from metrics hash' do
      expect(serializer_instance.as_json[:resource_type])
        .to eql(school_class.metrics[:resource_type])
    end
  end

  describe 'user' do
    it 'serializes resource_type from metrics hash' do
      expect(UserSerializer.new(school_class.user).as_json)
        .to include(serializer_instance.as_json[:user])
    end
  end

  describe 'course_school_classes' do
    it 'serializes resource_type from metrics hash' do
      ids = serializer_instance
            .as_json[:course_school_classes]
            .map { |course_school_class| course_school_class[:id] }

      expect(ids).to match_array(school_class.course_school_classes.map(&:id))
    end
  end
end
