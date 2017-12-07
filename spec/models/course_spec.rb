# frozen_string_literal: true

require 'spec_helper'

describe Course do
  let(:course) { create(:course) }

  describe 'associations' do
    it 'belongs_to topic' do
      is_expected.to belong_to(:topic).touch(true).order(:title)
    end

    describe 'has_many lessons' do
      it { is_expected.to have_many(:lessons).dependent(:destroy) }
    end

    describe 'has_many published_lessons' do
      it do
        is_expected.to(
          have_many(:published_lessons).conditions(published: true)
        )
      end
    end

    it { is_expected.to have_many(:course_school_classes).dependent(:destroy) }
    it { is_expected.to have_many(:school_classes).through(:course_school_classes) }
  end

  describe 'validations' do
    describe 'topic' do
      it { is_expected.to validate_presence_of(:topic) }
    end

    describe 'slug' do
      it { is_expected.to validate_presence_of(:slug) }
      it do
        expect(course).to(
          validate_uniqueness_of(:slug)
            .scoped_to(:topic_id)
            .case_insensitive
        )
      end
      it { is_expected.to validate_length_of(:slug).is_at_most(255) }
    end

    describe 'title' do
      it { is_expected.to validate_presence_of(:title) }
      it do
        expect(course).to(
          validate_uniqueness_of(:title)
            .scoped_to(:topic_id)
            .case_insensitive
        )
      end
      it { is_expected.to validate_length_of(:title).is_at_most(255) }
    end
  end
end
