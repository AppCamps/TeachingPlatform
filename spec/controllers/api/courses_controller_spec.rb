# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::CoursesController, api: :authenticate do
  include ActionView::Helpers::TextHelper

  let(:user) { create(:user) }

  before do
    set_json_api_content_type
    sign_in_user(user)

    Rails.cache.clear
  end

  describe 'GET #index' do
    it_behaves_like 'requires authentication' do
      let(:action) { -> { get :index } }
    end

    it 'returns serialized course and category' do
      create_list(:course, 2, :with_lessons, lessons_count: 1)

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      courses = document[:data]
      topics =
        document[:included].select { |r| r[:type] == 'topics' }
      lessons =
        document[:included].select { |r| r[:type] == 'lessons' }
      teaching_materials =
        document[:included].select { |r| r[:type] == 'teaching-materials' }
      common_mistakes =
        document[:included].select { |r| r[:type] == 'common-mistakes' }
      expertises =
        document[:included].select { |r| r[:type] == 'expertises' }

      expect(courses.length).to be(2)
      expect(topics.count).to be(2)
      expect(lessons.count).to be(2)
      expect(teaching_materials.count).to be(4)
      expect(common_mistakes.count).to be(4)
      expect(expertises.count).to be(2)
      expect(document[:included].length).to be(14)

      courses.each do |course_data|
        course = Course.find(course_data[:id])
        expect(course_data.dig(:attributes, :title)).to eql(course.title)
        expect(course_data.dig(:attributes, :description)).to eql(course.description)
        expect(course_data.dig(:attributes, :slug)).to eql(course.slug)

        topic = Topic.find(course_data.dig(:relationships, :topic, :data, :id))
        topic_data =
          topics.find { |topic_document| topic_document[:id] == topic.id }
        expect(topic_data.dig(:attributes, :title)).to eql(topic.title)

        lesson = Lesson.find(course_data.dig(:relationships, :lessons, :data).first[:id])
        lesson_data =
          lessons.find do |lesson_document|
            lesson_document[:id].to_i == lesson.id
          end
        expect(lesson_data.dig(:attributes, :title)).to eql(lesson.title)
        expect(lesson_data.dig(:attributes, :description)).to eql(simple_format(lesson.description))

        lesson_data
          .dig(:relationships, :'teaching-materials', :data)
          .map { |d| d[:id] }
          .each do |id|
            teaching_material = TeachingMaterial.find(id)
            teaching_material_data =
              teaching_materials.find do |teaching_material_document|
                teaching_material_document[:id] == teaching_material.id
              end
            expect(teaching_material_data.dig(:attributes, :title)).to eql(teaching_material.title)
          end

        lesson_data.dig(:relationships, :'common-mistakes', :data).map { |d| d[:id] }.each do |id|
          common_mistake = CommonMistake.find(id)
          common_mistake_data =
            common_mistakes.find do |common_mistake_document|
              common_mistake_document[:id] == common_mistake.id
            end
          expect(common_mistake_data.dig(:attributes, :problem)).to eql(common_mistake.problem)
          expect(common_mistake_data.dig(:attributes, :solution))
            .to eql(simple_format(common_mistake.solution))
        end

        lesson_data.dig(:relationships, :expertises, :data).map { |d| d[:id] }.each do |id|
          expertise = Expertise.find(id)
          expertise_data =
            expertises.find do |expertise_document|
              expertise_document[:id] == expertise.id
            end
          expect(expertise_data.dig(:attributes, :title)).to eql(expertise.title)
        end
      end
    end

    it 'only serializes published lessons' do
      unpublished_lessons_course = create(:course)
      one_published_lesson_course = create(:course)
      published_lessons_course = create(:course, :with_lessons, lessons_count: 2)

      create_list(:lesson, 2, :unpublished, course: unpublished_lessons_course)
      create(:lesson, :unpublished, course: one_published_lesson_course)

      published_lessons_ids = published_lessons_course.lessons.ids
      published_lessons_ids << create(:lesson, course: one_published_lesson_course).id

      published_courses = [one_published_lesson_course, published_lessons_course]

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      expect(document[:data].length).to be(2)
      expect(document[:data].map { |d| d[:id].to_i })
        .to match_array(published_courses.map(&:id))
      expect(document[:included].select { |d| d[:type] == 'lessons' }.map { |d| d[:id] })
        .to match_array(published_lessons_ids.map(&:to_s))
    end

    it 'only serializes all lessons for admin' do
      sign_in_user(create(:user, :admin))

      course_with_unpublished_lessons = create(:course)
      course_with_published_lessons = create(:course, :with_lessons)

      create_list(:lesson, 2, :unpublished, course: course_with_unpublished_lessons)

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access
      JSONAPI.parse_response!(document)

      course_data = document[:data]
      expect(course_data.length).to be(2)
      expect(course_data.map { |d| d[:id] })
        .to match_array([
                          course_with_unpublished_lessons.id.to_s,
                          course_with_published_lessons.id.to_s
                        ])

      lesson_ids = document[:included].select { |d| d[:type] == 'lessons' }.map { |d| d[:id] }

      expect(lesson_ids).to match_array(Lesson.all.map(&:id).map(&:to_s))
    end

    describe 'cached responses' do
      it 'uses updated_at as cache key' do
        Timecop.freeze do
          course = create(:course, :with_lessons, lessons_count: 1)
          topic = course.topic

          expect(controller).to receive(:cached).with("/api/courses/#{topic.updated_at.iso8601}")

          get :index

          one_week_later = 1.week.from_now
          Timecop.travel(one_week_later) do
            course.touch

            expect(controller).to receive(:cached).with("/api/courses/#{one_week_later.iso8601}")

            get :index
          end
        end
      end

      it 'uses updated_at with admin suffix as cache key for admin user' do
        sign_in_user(create(:user, :admin))

        Timecop.freeze do
          course = create(:course, :with_lessons, lessons_count: 1)
          topic = course.topic

          expect(controller)
            .to receive(:cached).with("/api/courses/#{topic.updated_at.iso8601}-unpublished")

          get :index

          one_week_later = 1.week.from_now
          Timecop.travel(one_week_later) do
            course.touch

            expect(controller)
              .to receive(:cached).with("/api/courses/#{one_week_later.iso8601}-unpublished")

            get :index
          end
        end
      end

      it 'caches responses' do
        create_list(:course, 2, :with_lessons, lessons_count: 1)

        expect(controller).to receive(:serialize_json).once.and_call_original

        get :index

        get :index
      end
    end
  end
end
