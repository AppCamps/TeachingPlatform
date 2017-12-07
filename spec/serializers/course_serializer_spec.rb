# frozen_string_literal: true

require 'spec_helper'

describe CourseSerializer do
  let(:current_user) { build(:user) }
  let(:course) { build(:course) }
  let(:serializer_instance) do
    described_class.new(
      course,
      scope: current_user,
      scope_name: :current_user
    )
  end

  describe 'has_many lessons' do
    it 'serializes published lessons users' do
      expect(course).to receive(:published_lessons).and_call_original

      serializer_instance.serializable_hash
    end

    describe 'admin users' do
      let(:current_user) { build(:user, :admin) }

      it 'serializes lessons' do
        expect(course).to receive(:lessons).and_call_original

        serializer_instance.serializable_hash
      end
    end

    describe 'beta users' do
      let(:current_user) { build(:user, :beta) }

      it 'serializes lessons' do
        expect(course).to receive(:lessons).and_call_original

        serializer_instance.serializable_hash
      end
    end
  end

  it 'belongs_to topic' do
    topic_hash = serializer_instance.serializable_hash[:topic]

    expect(topic_hash).to eql(
      TopicSerializer.new(
        course.topic,
        scope: current_user,
        scope_name: :current_user
      )
      .serializable_hash
      .except(:topic, :courses, :preparation_materials)
    )
  end

  %i[
    title description slug position
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash)
        .to have_key(attribute_name.to_sym)
    end
  end

  describe '#certificate' do
    describe 'is present' do
      let(:course) { build(:course, :with_certificate) }

      it 'returns true' do
        expect(serializer_instance.serializable_hash[:certificate]).to be(true)
      end
    end

    describe 'is absent' do
      let(:course) { build(:course, certificate: nil) }

      it 'returns true' do
        expect(serializer_instance.serializable_hash[:certificate]).to be(false)
      end
    end
  end
end
