# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::CourseSchoolClassesController, api: :authenticate do
  before do
    set_json_api_content_type
    sign_in_user(user)
  end

  describe 'PATCH #update' do
    let(:course_school_class) { create(:course_school_class, certificate_downloaded: false) }
    let(:user) { course_school_class.school_class.user }
    let(:params) do
      {
        id: course_school_class.id,
        data: {
          id: course_school_class.id,
          type: 'school-classes',
          attributes: {
            certificate_downloaded: true
          }
        }
      }.with_indifferent_access
    end

    it_behaves_like 'requires authentication' do
      let(:action) { -> { patch :update, params: params } }
    end

    it 'updates certificate downloaded and return serialized json' do
      patch :update, params: params
      expect(response).to have_http_status(:ok)

      result = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(result)

      expect(result.dig('data', 'attributes', 'certificate-downloaded')).to be(true)
    end
  end
end
