# frozen_string_literal: true

require 'spec_helper'

describe Topic do
  describe 'associations' do
    it { is_expected.to have_many(:courses) }
    it { is_expected.to have_many(:preparation_materials) }

    it do
      is_expected.to(
        have_many(:published_preparation_materials)
        .conditions(published: true)
        .class_name(PreparationMaterial)
        .inverse_of(:topic)
      )
    end

    it do
      is_expected.to(
        have_many(:published_courses)
        .conditions(Course.published)
        .class_name(Course)
        .inverse_of(:topic)
      )
    end

    it 'published_courses' do
      topic = create(:topic)
      _unpublished_course = create(:course, :unpublished, topic: topic)
      published_course = create(:course, :with_lessons, topic: topic, lessons_count: 3)

      expect(topic.published_courses).to match_array([published_course])
    end
  end

  describe 'validations' do
    it 'validates presence of title' do
      is_expected.to validate_presence_of(:title)
    end
  end
end
