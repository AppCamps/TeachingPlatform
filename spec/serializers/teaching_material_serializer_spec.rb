# frozen_string_literal: true

require 'spec_helper'

describe TeachingMaterialSerializer do
  let(:teaching_material) { build(:teaching_material) }
  let(:serializer_instance) do
    described_class.new(teaching_material)
  end

  it 'belongs_to lesson' do
    lesson_hash =
      serializer_instance
      .serializable_hash[:lesson]

    expect(lesson_hash).to eql(
      LessonSerializer
        .new(teaching_material.lesson).serializable_hash
        .except(:teaching_materials, :common_mistakes, :expertises, :course)
    )
  end

  %i[
    medium_type title subtitle image link lesson_content
    listing_item listing_title listing_icon position
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash)
        .to have_key(attribute_name.to_sym)
    end
  end

  it 'image' do
    expect(serializer_instance.serializable_hash[:image])
      .to match(%r{/uploads/})
  end
end
