# frozen_string_literal: true

require 'spec_helper'

describe Lesson do
  let(:course) { create(:course) }
  let(:lesson) { create(:lesson, course: course) }

  it { is_expected.to belong_to(:course).touch(true) }
  it { is_expected.to have_many(:teaching_materials).dependent(:destroy) }
  it { is_expected.to have_many(:common_mistakes).through(:common_mistake_lessons) }
  it { is_expected.to have_many(:common_mistake_lessons).dependent(:destroy) }
  it { is_expected.to have_many(:expertise_lessons) }
  it { is_expected.to have_many(:expertises).through(:expertise_lessons) }

  describe 'scopes' do
    it 'published' do
      _unpublished_lesson = create(:lesson, published: false)
      published_lesson = create(:lesson, published: true)

      expect(described_class.published).to match([published_lesson])
    end
  end

  describe 'association callbacks' do
    describe 'expertises' do
      it 'touches lesson after_remove' do
        lesson.expertises << create(:expertise)

        expect(lesson).to receive(:touch).at_least(:once)

        lesson.expertises = []
      end
    end
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:course) }
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_uniqueness_of(:title).scoped_to(:course_id) }
    it { is_expected.to validate_uniqueness_of(:description).scoped_to(:course_id) }
  end
end
