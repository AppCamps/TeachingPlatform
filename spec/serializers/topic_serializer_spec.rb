# frozen_string_literal: true

require 'spec_helper'

describe TopicSerializer do
  let(:topic) { create(:topic) }
  let(:current_user) { create(:user) }
  let(:serializer_instance) do
    described_class.new(topic, scope: current_user, scope_name: :current_user)
  end

  it 'serializes title' do
    expect(serializer_instance.serializable_hash[:title]).to eql(topic.title)
  end

  it 'serializes color' do
    topic.color = nil
    expect(serializer_instance.serializable_hash[:color]).to be(nil)

    topic.color = '33ac21'
    expect(serializer_instance.serializable_hash[:color]).to eql('#33ac21')
  end

  it 'serializes light_color' do
    topic.light_color = nil
    expect(serializer_instance.serializable_hash[:light_color]).to be(nil)

    topic.light_color = '3aac21'
    expect(serializer_instance.serializable_hash[:light_color]).to eql('#3aac21')
  end

  it 'serializes icon' do
    expect(serializer_instance.serializable_hash[:icon])
      .to match(%r{/uploads/})
  end

  describe 'courses' do
    context 'when user' do
      let(:published_courses) { create_list(:course, 2, :published, topic: topic) }

      it 'serializes published_courses' do
        create_list(:course, 2, :unpublished, topic: topic)

        serialized_published_courses = published_courses.map do |course|
          CourseSerializer.new(course, scope: current_user, scope_name: :current_user)
                          .serializable_hash
        end

        expect(serializer_instance.serializable_hash[:courses])
          .to match_array(
            serialized_published_courses.map { |c| c.except(:topic, :lessons) }
          )
      end
    end

    context 'when admin' do
      let(:courses) { create_list(:course, 2, :unpublished, topic: topic) }
      let(:current_user) { create(:admin) }

      it 'serializes courses' do
        serialized_courses = courses.map do |course|
          CourseSerializer.new(course, scope: current_user, scope_name: :current_user)
                          .serializable_hash
        end
        expect(serializer_instance.serializable_hash[:courses])
          .to match_array(
            serialized_courses.map { |c| c.except(:topic, :lessons) }
          )
      end
    end
  end

  describe 'preparation_materials' do
    context 'when user' do
      let(:published_preparation_materials) { create_list(:preparation_material, 2, topic: topic) }

      it 'serializes published_preparation_materials' do
        serialized_published_preparation_materials =
          published_preparation_materials.map do |preparation_material|
            PreparationMaterialSerializer.new(preparation_material).serializable_hash.except(:topic)
          end

        expect(serializer_instance.serializable_hash[:preparation_materials])
          .to match_array(serialized_published_preparation_materials)
      end
    end

    context 'when admin' do
      let(:preparation_materials) { create_list(:preparation_material, 2, :unpublished) }
      let(:current_user) { create(:admin) }

      it 'serializes preparation_materials' do
        topic.preparation_materials = preparation_materials

        serialized_preparation_materials = preparation_materials.map do |preparation_material|
          PreparationMaterialSerializer.new(preparation_material).serializable_hash.except(:topic)
        end
        expect(serializer_instance.serializable_hash[:preparation_materials])
          .to match_array(serialized_preparation_materials)
      end
    end
  end
end
