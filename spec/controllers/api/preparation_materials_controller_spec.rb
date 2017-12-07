# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::PreparationMaterialsController, api: :authenticate do
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

    # A published course is a course with at least one published lesson
    it 'does not serialize topics without published_courses' do
      preparation_materials = create_list(:preparation_material, 2)
      # Topic with one course with at least one published lesson (should be serialized)
      topic1 = preparation_materials.first.topic
      topic1.courses = [create(:course)]
      course1 = topic1.courses.first
      course1.lessons = [create(:lesson)]
      # Topic with one course with unpublished lessons (should not be serialized)
      topic2 = preparation_materials.second.topic
      topic2.courses = [create(:course)]
      course2 = topic2.courses.first
      course2.lessons = [create(:lesson, :unpublished)]

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)
      topics_data = document[:data]

      expect(topics_data.count).to be(1)

      expect(topic1.id).to eql(topics_data.first[:id])
    end

    it 'returns serializes and returns all topics' do
      preparation_materials = create_list(:preparation_material, 2)
      preparation_materials << create(:preparation_material, :unpublished)

      topics = preparation_materials.map(&:topic)
      topics.each do |topic|
        topic.courses = [create(:course, topic: topic)]
        course = topic.courses.first
        course.lessons = [create(:lesson)]
      end
      topic_ids = topics.map(&:id)

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)
      topics_data = document[:data]

      expect(topics_data.count).to be(3)

      topics_data.each do |topic_data|
        topic = Topic.find(topic_data[:id])
        expect(topic_ids).to include(topic_data[:id])
        topic_data =
          topics_data.find { |topic_document| topic_document[:id] == topic.id }
        expect(topic_data.dig(:attributes, :title)).to eql(topic.title)
      end
    end

    it 'only serializes preparation_materials that are published' do
      topic = create(:topic)
      topic.courses = [create(:course, topic: topic)]
      course1 = topic.courses.first
      course1.lessons = [create(:lesson)]

      published_preparation_materials = create_list(:preparation_material, 2, topic: topic)
      unpublished_preparation_material = create(:preparation_material, :unpublished)

      unpublished_preparation_material.topic.courses = [create(:course)]
      course2 = unpublished_preparation_material.topic.courses.first
      course2.lessons = [create(:lesson)]

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      expect(document[:data].length).to be(2)
      expect(document[:included].length).to be(2)

      topic_ids = document[:data].map { |d| d[:id] }
      expect(topic_ids).to include(topic.id)
      expect(topic_ids).to include(unpublished_preparation_material.topic_id)

      serialized_preparation_materials =
        document[:included].select { |i| i[:type] == 'preparation-materials' }

      expect(serialized_preparation_materials.map { |d| d[:id] })
        .not_to eql(unpublished_preparation_material.id)
      expect(serialized_preparation_materials.map { |d| d[:id] })
        .to match_array(published_preparation_materials.map(&:id))
    end

    context 'when admin' do
      it 'serializes all published preparation_materials and topics' do
        sign_in_user(create(:user, :admin))

        preparation_materials = create_list(:preparation_material, 2, :unpublished)

        get :index

        expect(response).to have_http_status(:ok)

        document = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(document)
        expect(document[:data].length).to be(2)
        expect(document[:included].length).to be(2)
        expect(document[:included].map { |d| d[:type] }.uniq)
          .to match_array('preparation-materials')
        expect(document[:included].map { |d| d[:id] })
          .to match_array(preparation_materials.map(&:id))
      end
    end

    describe 'cached responses' do
      it 'uses updated_at as cache key' do
        Timecop.freeze do
          preparation_material = create(:preparation_material)

          expect(controller).to(
            receive(:cached)
              .with("/api/preparation-materials/#{preparation_material.topic.updated_at.iso8601}")
          )

          get :index

          one_week_later = 1.week.from_now
          Timecop.travel(one_week_later) do
            preparation_material.touch

            expect(controller)
              .to receive(:cached).with("/api/preparation-materials/#{one_week_later.iso8601}")

            get :index
          end
        end
      end

      it 'uses updated_at with admin suffix as cache key for admin user' do
        sign_in_user(create(:user, :admin))

        Timecop.freeze do
          preparation_material = create(:preparation_material, :unpublished)

          expect(controller)
            .to(
              receive(:cached)
                .with("/api/preparation-materials/#{preparation_material.topic.updated_at.iso8601}-unpublished") # rubocop:disable LineLength
            )

          get :index

          one_week_later = 1.week.from_now
          Timecop.travel(one_week_later) do
            preparation_material.touch

            expect(controller)
              .to(
                receive(:cached)
                  .with("/api/preparation-materials/#{one_week_later.iso8601}-unpublished")
              )

            get :index
          end
        end
      end

      it 'caches responses' do
        create_list(:preparation_material, 2)

        expect(controller).to receive(:serialize_json).once.and_call_original

        get :index

        get :index
      end
    end
  end
end
