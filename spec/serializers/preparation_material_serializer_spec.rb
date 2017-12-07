# frozen_string_literal: true

require 'spec_helper'

describe PreparationMaterialSerializer do
  let(:current_user) { build(:user) }
  let(:preparation_material) { build(:preparation_material) }
  let(:serializer_instance) do
    described_class.new(preparation_material)
  end

  it 'belongs_to topic' do
    topic_hash = serializer_instance.serializable_hash[:topic]

    expect(topic_hash).to eql(
      TopicSerializer.new(
        preparation_material.topic,
        scope: current_user,
        scope_name: :current_user
      )
      .serializable_hash
      .except(:topic, :courses, :preparation_materials)
    )
  end

  %i[
    medium_type title subtitle description icon link position topic
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash)
        .to have_key(attribute_name.to_sym)
    end
  end
end
