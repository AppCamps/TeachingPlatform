# frozen_string_literal: true

require 'spec_helper'

describe LessonSerializer do
  let(:lesson) { create(:lesson) }
  let(:serializer_instance) { described_class.new(lesson) }

  %i[title description position].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash)
        .to have_key(attribute_name.to_sym)
    end
  end

  it 'has_many teaching_materials' do
    teaching_materials_hash =
      serializer_instance.serializable_hash[:teaching_materials]
    expect(teaching_materials_hash.class).to eql(Array)
    teaching_materials_hash.each_with_index do |teaching_material, index|
      expect(teaching_material).to eql(
        TeachingMaterialSerializer.new(
          lesson.teaching_materials[index]
        )
        .serializable_hash
        .except(:lesson)
      )
    end
  end

  it 'has_many common_mistakes' do
    common_mistakes_hash =
      serializer_instance.serializable_hash[:common_mistakes]
    expect(common_mistakes_hash.class).to eql(Array)
    common_mistakes_hash.each_with_index do |common_mistake_hash, index|
      expect(common_mistake_hash).to eql(
        CommonMistakeSerializer.new(
          lesson.common_mistakes[index]
        )
        .serializable_hash
        .except(:lessons)
      )
    end
  end

  it 'has_many expertises' do
    expertises_hash =
      serializer_instance.serializable_hash[:expertises]
    expect(expertises_hash.class).to eql(Array)
    expertises_hash.each_with_index do |expertise_hash, index|
      expect(expertise_hash).to eql(
        ExpertiseSerializer.new(lesson.expertises[index])
          .serializable_hash
          .except(:lessons)
      )
    end
  end

  it 'simple_formats decription' do
    klass = Class.new do
      include ActionView::Helpers::TextHelper
    end

    lesson = build(:lesson, description: "some\ntest\n\nhere")
    serializer = described_class.new(lesson)
    expect(serializer.serializable_hash[:description])
      .to eql(klass.new.simple_format(lesson.description))
  end
end
