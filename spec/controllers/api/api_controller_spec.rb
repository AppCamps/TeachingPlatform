# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::ApiController, api: true do
  include Support::Controller::Api::ContentType

  controller(Api::ApiController) do
    def index
      render json: { meta: { test: :ok } }, status: :ok
    end

    def show
      params.require(:'some-parameter')
    end

    def create
      render json: { meta: { test: :ok } }, status: :ok
    end
  end

  let(:user) { create(:user) }
  let(:action) { -> { get :index } }

  describe 'deep_underscore_param_keys' do
    before do
      set_json_api_content_type
      sign_in user
    end

    it { is_expected.to use_before_action(:deep_underscore_param_keys) }

    it 'deep transforms parameter keys to underscore' do
      Timecop.freeze do
        json_api_request = {
          data: {
            attributes: {
              type: 'question',
              'some-title': 'Hellp',
              'created-at': Time.zone.now.to_i
            }
          }
        }

        post :create, params: json_api_request

        transfomed_params = controller.params

        attributes = transfomed_params.dig(:data, :attributes)
        expect(attributes[:type]).to eql('question')
        expect(attributes['type']).to eql('question')
        expect(attributes[:some_title]).to eql('Hellp')
        expect(attributes['some_title']).to eql('Hellp')
        expect(attributes[:created_at]).to eql(Time.zone.now.to_i)
        expect(attributes['created_at']).to eql(Time.zone.now.to_i)
      end
    end
  end

  describe 'authentication' do
    before do
      set_json_api_content_type
    end

    it_behaves_like 'requires authentication'

    it 'sets current user after successful login' do
      sign_in user

      get :index

      expect(controller.current_user).to eql(user)
    end
  end

  describe 'mime type' do
    before do
      sign_in user
    end

    it 'requires json_api mime type' do
      request.content_type = Mime[:json].to_s

      get :index

      expect(response).to have_http_status(:not_acceptable)

      set_json_api_content_type

      get :index

      expect(response).to have_http_status(:ok)
    end

    it 'returns json api content type' do
      set_json_api_content_type

      get :index

      expect(response.content_type).to eql(Mime[:jsonapi].to_s)
    end
  end

  describe 'rescues' do
    before do
      set_json_api_content_type

      sign_in user
    end

    describe ActionController::ParameterMissing do
      it 'serializes json api error object with attribute pointer' do
        get :show, params: { id: 0 }

        result = JSON.parse(response.body).deep_symbolize_keys

        error = result[:errors].first
        pointer = error.dig(:source, :pointer)
        detail = error[:detail]

        expect(pointer).to eql('/data/attributes/some-parameter')
        expect(detail).to match(/: some-parameter$/)
      end
    end

    describe Api::ApiController::AuthenticationMissingError do
      it 'serializes json api error with AuthorizationError' do
        Timecop.freeze do
          sign_out :user

          get :show, params: { id: 0 }

          result = JSON.parse(response.body).deep_symbolize_keys

          error = result[:errors].first

          expect(error[:code]).to eql('authentication_error')
          expect(error[:title]).to be(nil)
        end
      end
    end

    describe Api::ApiController::AuthenticationPrivacyPolicyMissingError do
      it 'returns privacy policy not accepted error' do
        Timecop.freeze(User::LAST_PRIVACY_POLICY_UPDATE) do
          user.update(privacy_policy_accepted_at: 1.year.ago)

          get :show, params: { id: 0 }

          result = JSON.parse(response.body).deep_symbolize_keys

          error = result[:errors].first

          expect(error[:code]).to eql('authentication_error')
          expect(error[:title]).to eql('Privacy Policy not accepted')
        end
      end
    end
  end
end
