# frozen_string_literal: true

require 'spec_helper'

describe ExpertiseSerializer do
  let(:lesson) { build(:lesson) }
  let(:expertise) { build(:expertise, lessons: [lesson]) }
  let(:serializer_instance) do
    described_class.new(expertise)
  end

  it 'serializes title' do
    expect(serializer_instance.serializable_hash[:title])
      .to equal(expertise.title)
  end

  it 'serializes lesson' do
    expect(serializer_instance.serializable_hash[:lessons][0]).to eql(
      LessonSerializer.new(lesson)
        .serializable_hash
        .except(:expertises, :course, :common_mistakes, :teaching_materials)
    )
  end
end
