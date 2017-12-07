# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::SchoolClassesController, api: :authenticate do
  let(:user) { create(:user) }

  before do
    set_json_api_content_type
    sign_in_user(user)
  end

  describe 'GET #index' do
    it_behaves_like 'requires authentication' do
      let(:action) { -> { get :index } }
    end

    it 'returns SchoolClasses of user' do
      create_list(:school_class, 2, :class)
      create_list(:school_class, 2, :group)
      create_list(:school_class, 2, :class, user: user)
      create_list(:school_class, 2, :group, user: user)

      get :index

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      school_classes_data = document[:data]
      expect(school_classes_data.count).to be(4)
      expect(school_classes_data.map { |school_class| school_class[:id] })
        .to match_array(user.reload.school_class_ids)
    end

    it 'filters data' do
      school_classes = create_list(:school_class, 2, :class, user: user)

      get :index, params: { filter: { 'classes.id' => school_classes.first.id } }

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      school_class_data = document[:data]

      expect(school_class_data.length).to be(1)
      expect(school_class_data.first[:id]).to eql(school_classes.first.id)
    end

    it 'includes course_school_classes' do
      create(:school_class, :group, user: user)

      get :index

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      school_classes_data = document[:data]
      expect(school_classes_data.count).to be(1)
      expect(school_classes_data.map { |school_class| school_class[:id] })
        .to match_array(user.reload.school_class_ids)

      expect(document[:included].count).to equal(2)

      expect(document[:included].map { |i| i[:type] }.uniq)
        .to match_array(%w[course-school-classes])
    end
  end

  describe 'POST #create' do
    let(:params) do
      attributes =
        attributes_for(:school_class)
        .reject { |key| key == :courses }
        .deep_transform_keys { |key| key.to_s.dasherize }

      {
        data: {
          type: 'school-classes',
          attributes: attributes
        }
      }.with_indifferent_access
    end

    let(:class_params) do
      attributes =
        attributes_for(:school_class, :class)
        .reject { |key| key == :courses }
        .deep_transform_keys { |key| key.to_s.dasherize }

      {
        data: {
          type: 'school-classes',
          attributes: attributes
        }
      }.with_indifferent_access
    end

    let(:group_params) do
      attributes =
        attributes_for(:school_class, :group)
        .reject { |key| key == :courses }
        .deep_transform_keys { |key| key.to_s.dasherize }

      {
        data: {
          type: 'school-classes',
          attributes: attributes
        }
      }.with_indifferent_access
    end

    it_behaves_like 'requires authentication' do
      let(:action) { -> { post :create, params: params } }
    end

    it 'returns error if user has wants to add an unpublished course' do
      course = create(:course, :unpublished)

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: course.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      post :create, params: class_params
      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      error = result[:errors].first
      expect(error.dig(:source, :pointer)).to eql('/data/relationships/courses')
    end

    it 'returns if admin adds an unpublished course' do
      user.update(admin: true)

      course = create(:course, :unpublished)

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: course.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      post :create, params: class_params
      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      expect(result[:errors]).not_to be
    end

    it 'works for multiple courses with same topic' do
      topic = create(:topic)

      course1 = create(:course, :with_lessons, topic: topic)
      course2 = create(:course, :with_lessons, topic: topic)
      create(:course, :with_lessons)

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: course1.id.to_s,
                                      type: 'courses'
                                    },
                                    {
                                      id: course2.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      post :create, params: class_params
      expect(response).to have_http_status(:created)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      expect(result[:errors]).not_to be

      expect(SchoolClass.last.course_ids).to match_array([course1.id, course2.id])
    end

    it 'returns error if metrics json is not valid' do
      class_params[:data][:attributes][:'resource-type'] = 'dunno'

      post :create, params: class_params
      expect(user.school_classes.count).to be(0)

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      error = result[:errors].first
      expect(error.dig(:source, :pointer)).to eql('/data/attributes/resource-type')
    end

    context 'when school_class' do
      it 'creates school_class' do
        course = create(:course, :with_lessons)

        class_params[:data] = class_params[:data]
                              .merge(
                                relationships: {
                                  courses: {
                                    data: [
                                      {
                                        id: course.id.to_s,
                                        type: 'courses'
                                      }
                                    ]
                                  }
                                }
                              ).with_indifferent_access

        post :create, params: class_params
        expect(user.school_classes.count).to be(1)

        school_class = user.school_classes.first
        params =
          class_params
          .dig(:data, :attributes)
          .each_with_object({}) do |(k, v), memo|
            memo[k.underscore] = v
          end
        expect(school_class.metrics).to eql(params)

        expect(school_class.courses).to match_array([course])
      end

      it 'requires class_name' do
        class_params['data']['attributes'].delete('class-name')

        post :create, params: class_params
        expect(user.school_classes.count).to be(0)

        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/class-name')
      end

      it 'requires school_year' do
        class_params['data']['attributes'].delete('school-year')

        post :create, params: class_params
        expect(user.school_classes.count).to be(0)

        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/school-year')
      end
    end

    context 'when extracurricular' do
      it 'creates extracurricular school_class' do
        course = create(:course, :with_lessons)

        group_params[:data] = group_params[:data]
                              .merge(
                                relationships: {
                                  courses: {
                                    data: [
                                      {
                                        id: course.id.to_s,
                                        type: 'courses'
                                      }
                                    ]
                                  }
                                }
                              ).with_indifferent_access

        post :create, params: group_params
        expect(user.school_classes.count).to be(1)

        school_class = user.school_classes.first
        params =
          group_params
          .dig(:data, :attributes)
          .each_with_object({}) do |(k, v), memo|
            memo[k.underscore] = v
          end
        expect(school_class.metrics).to eql(params)
        expect(school_class.courses).to match_array([course])
      end

      it 'requires group_name' do
        group_params['data']['attributes'].delete('group-name')

        post :create, params: group_params
        expect(user.school_classes.count).to be(0)

        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/group-name')
      end

      it 'requires year' do
        group_params['data']['attributes'].delete('year')

        post :create, params: group_params
        expect(user.school_classes.count).to be(0)

        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/year')
      end
    end
  end

  describe 'PATCH #update' do
    let(:school_class) { create(:school_class, :class, user: user) }
    let(:params) do
      attributes =
        attributes_for(:school_class)
        .reject { |key| key == :courses }
        .deep_transform_keys { |key| key.to_s.dasherize }

      {
        id: school_class.id,
        data: {
          id: school_class.id,
          type: 'school-classes',
          attributes: attributes
        }
      }.with_indifferent_access
    end

    let(:class_params) do
      attributes =
        attributes_for(:school_class, :class)
        .reject { |key| key == :courses }
        .deep_transform_keys { |key| key.to_s.dasherize }

      {
        id: school_class.id,
        data: {
          id: school_class.id,
          type: 'school-classes',
          attributes: attributes
        }
      }.with_indifferent_access
    end

    let(:group_params) do
      attributes =
        attributes_for(:school_class, :group)
        .reject { |key| key == :courses }
        .deep_transform_keys { |key| key.to_s.dasherize }

      {
        id: school_class.id,
        data: {
          id: school_class.id,
          type: 'school-classes',
          attributes: attributes
        }
      }.with_indifferent_access
    end

    it_behaves_like 'requires authentication' do
      let(:action) { -> { patch :update, params: params } }
    end

    it 'returns error if user has wants to add an unpublished course' do
      course = create(:course, :unpublished)

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: course.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      patch :update, params: class_params
      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      error = result[:errors].first
      expect(error.dig(:source, :pointer)).to eql('/data/relationships/courses')
    end

    it 'returns works if admin adds an unpublished course' do
      user.update(admin: true)

      course = create(:course, :unpublished)

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: course.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      patch :update, params: class_params
      expect(response).to have_http_status(:ok)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      expect(result[:errors]).not_to be
    end

    it 'works for multiple courses with same topic' do
      topic = create(:topic)
      course1 = create(:course, :with_lessons, topic: topic)
      course2 = create(:course, :with_lessons, topic: topic)

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: course1.id.to_s,
                                      type: 'courses'
                                    },
                                    {
                                      id: course2.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      patch :update, params: class_params
      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)
      expect(result[:errors]).not_to be

      expect(SchoolClass.last.course_ids).to match_array([course1.id, course2.id])
    end

    it 'returns error if metrics json is not valid' do
      params[:data][:attributes][:'resource-type'] = 'dunno'

      patch :update, params: params
      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      error = result[:errors].first
      expect(error.dig(:source, :pointer)).to eql('/data/attributes/resource-type')
    end

    it 'can remove last completed course' do
      school_class.courses = create_list(:course, 2, :with_lessons)
      school_class.completed_lessons = school_class.courses.first.lessons

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  # rack changes data: [] to data: nil
                                  data: nil
                                }
                              }
                            ).with_indifferent_access

      patch :update, params: class_params
      expect(response).to have_http_status(:ok)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      school_class.reload

      expect(school_class.courses).to be_empty
      expect(school_class.completed_lessons).to be_empty
    end

    it 'can remove completed_lessons relation of remove courses' do
      first_course = create(:course, :with_lessons)
      second_course = create(:course, :with_lessons)

      school_class.courses = [first_course, second_course]
      school_class.completed_lessons = [
        first_course.lessons.first,
        second_course.lessons.first
      ]

      class_params[:data] = class_params[:data]
                            .merge(
                              relationships: {
                                courses: {
                                  data: [
                                    {
                                      id: first_course.id.to_s,
                                      type: 'courses'
                                    }
                                  ]
                                }
                              }
                            ).with_indifferent_access

      patch :update, params: class_params
      expect(response).to have_http_status(:ok)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      school_class.reload

      expect(school_class.courses).to match_array([first_course])
      expect(school_class.completed_lessons).to match_array([first_course.lessons.first])
    end

    context 'when school_class' do
      it 'creates school_class' do
        course = create(:course, :with_lessons)

        class_params[:data] = class_params[:data]
                              .merge(
                                relationships: {
                                  courses: {
                                    data: [
                                      {
                                        id: course.id.to_s,
                                        type: 'courses'
                                      }
                                    ]
                                  }
                                }
                              ).with_indifferent_access

        patch :update, params: class_params
        school_class = user.school_classes.first
        params =
          class_params
          .dig(:data, :attributes)
          .each_with_object({}) do |(k, v), memo|
            memo[k.underscore] = v
          end
        expect(school_class.metrics).to eql(params)

        expect(school_class.courses).to match_array([course])
      end

      it 'requires class_name' do
        class_params['data']['attributes'].delete('class-name')

        patch :update, params: class_params
        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/class-name')
      end

      it 'requires school_year' do
        class_params['data']['attributes'].delete('school-year')

        patch :update, params: class_params
        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/school-year')
      end
    end

    context 'when extracurricular' do
      it 'creates extracurricular school_class' do
        course = create(:course, :with_lessons)

        group_params[:data] = group_params[:data]
                              .merge(
                                relationships: {
                                  courses: {
                                    data: [
                                      {
                                        id: course.id.to_s,
                                        type: 'courses'
                                      }
                                    ]
                                  }
                                }
                              ).with_indifferent_access

        patch :update, params: group_params
        school_class = user.school_classes.first
        params =
          group_params
          .dig(:data, :attributes)
          .each_with_object({}) do |(k, v), memo|
            memo[k.underscore] = v
          end
        expect(school_class.metrics).to eql(params)
        expect(school_class.courses).to match_array([course])
      end

      it 'requires group_name' do
        group_params['data']['attributes'].delete('group-name')

        patch :update, params: group_params
        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/group-name')
      end

      it 'requires year' do
        group_params['data']['attributes'].delete('year')

        patch :update, params: group_params
        expect(response).to have_http_status(:unprocessable_entity)
        result = JSON.parse(response.body).with_indifferent_access

        JSONAPI.parse_response!(result)

        error = result[:errors].first
        expect(error.dig(:source, :pointer)).to eql('/data/attributes/year')
      end
    end
  end

  describe 'PATCH #update_completed_lessons_relationship' do
    let(:school_class) { create(:school_class, :class, user: user) }

    it_behaves_like 'requires authentication' do
      let(:action) do
        proc do
          patch :update_completed_lessons_relationship,
                params: { id: school_class.id, data: nil }
        end
      end
    end

    it 'clears lessons on empty nil' do
      school_class.completed_lessons << Lesson.first

      patch :update_completed_lessons_relationship,
            params: {
              id: school_class.id,
              data: nil
            }

      expect(response).to have_http_status(:ok)
      expect(school_class.reload.completed_lessons).to be_empty
    end

    it 'adds given lessons' do
      patch :update_completed_lessons_relationship,
            params: {
              id: school_class.id,
              data: [
                { type: 'lessons', id: Lesson.first.id.to_s }
              ]
            }

      expect(response).to have_http_status(:ok)
      expect(school_class.reload.completed_lessons).to match_array([Lesson.first])
    end

    it 'does not duplicate lessons' do
      school_class.completed_lessons << Lesson.first

      patch :update_completed_lessons_relationship,
            params: {
              id: school_class.id,
              data: [
                { type: 'lessons', id: Lesson.first.id.to_s }
              ]
            }

      expect(school_class.reload.completed_lessons).to match_array([Lesson.first])
      expect(response).to have_http_status(:ok)
    end

    it 'returns :forbidden lessons that are not in a related course' do
      patch :update_completed_lessons_relationship,
            params: {
              id: school_class.id,
              data: [
                { type: 'lessons', id: create(:lesson).id.to_s }
              ]
            }

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'DELETE #destroy_completed_lessons_relationship' do
    let(:school_class) { create(:school_class, :class, user: user) }

    it_behaves_like 'requires authentication' do
      let(:action) do
        proc do
          delete :destroy_completed_lessons_relationship,
                 params: { id: school_class.id, data: nil }
        end
      end
    end

    it 'does nothing if data.nil?' do
      school_class.completed_lessons << Lesson.first

      # rails params parser translates data: [] to data: nil
      delete :destroy_completed_lessons_relationship,
             params: {
               id: school_class.id,
               data: nil
             }

      expect(response).to have_http_status(:ok)
      expect(school_class.reload.completed_lessons).to match_array([Lesson.first])
    end

    it 'removes given lessons' do
      school_class.completed_lessons << Lesson.first

      delete :destroy_completed_lessons_relationship,
             params: {
               id: school_class.id,
               data: [
                 { type: 'lessons', id: Lesson.first.id.to_s }
               ]
             }

      expect(response).to have_http_status(:ok)
      expect(school_class.reload.completed_lessons).to be_empty
    end

    it 'returns :forbidden lessons that are not in a related course' do
      delete :destroy_completed_lessons_relationship,
             params: {
               id: school_class.id,
               data: [
                 { type: 'lessons', id: create(:lesson).id.to_s }
               ]
             }

      expect(response).to have_http_status(:forbidden)
    end
  end
end
