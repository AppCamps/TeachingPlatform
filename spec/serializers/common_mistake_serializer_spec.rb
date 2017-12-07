# frozen_string_literal: true

require 'spec_helper'

describe CommonMistakeSerializer do
  let(:common_mistake) { build(:common_mistake, lessons: [build(:lesson)]) }
  let(:serializer_instance) do
    described_class.new(common_mistake)
  end

  it 'has_many lessons' do
    expect(serializer_instance.serializable_hash[:lessons]).to eql(
      [LessonSerializer.new(common_mistake.lessons.first)
        .serializable_hash.except(:expertises, :course, :common_mistakes, :teaching_materials)]
    )
  end

  %i[
    position problem
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash[attribute_name])
        .to eql(common_mistake.send(attribute_name.to_sym))
    end
  end

  it 'serializes solution with simple_format' do
    klass = Class.new do
      include ActionView::Helpers::TextHelper
    end

    expect(serializer_instance.serializable_hash[:solution])
      .to eql(klass.new.simple_format(common_mistake.solution))
  end
end
