# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::SessionsController, api: :authenticate do
  let(:user) { create(:user) }

  before do
    set_json_api_content_type
  end

  describe 'POST #create' do
    context 'when valid user data' do
      it 'returns serialized session with user' do
        Timecop.freeze do
          post :create,
               params: {
                 data: {
                   attributes: {
                     email: user.email,
                     password: user.password
                   }
                 }
               }

          expect(response).to have_http_status(:created)

          result = JSON.parse(response.body)

          JSONAPI.parse_response!(result)

          document = result.deep_symbolize_keys
          user_id = document.dig(:data, :relationships, :user, :data, :id).to_i
          user_email = document.dig(:included, 0, :attributes, :email)
          school_classes_count = document.dig(:included, 0, :attributes, :'school-classes-count')

          expect(user_id).to eql(user.id)
          expect(user_email).to eql(user.email)
          expect(school_classes_count).to be(0)
          expect(document.dig(:data, :relationships).length).to be(1)
        end
      end

      it 'includes locality if present' do
        Timecop.freeze do
          locality = create(:locality, user: user)
          user.current_locality = locality

          post :create,
               params: {
                 data: {
                   attributes: {
                     email: user.email,
                     password: user.password
                   }
                 }
               }

          expect(response).to have_http_status(:created)

          result = JSON.parse(response.body)

          JSONAPI.parse_response!(result)

          document = result.deep_symbolize_keys

          expect(document.dig(:included).length).to be(2)

          locality = document.dig(:included, 1, :id)

          expect(locality).to eql(user.current_locality.id)
        end
      end

      it 'increments sign_in_count by one' do
        expect do
          post :create,
               params: {
                 data: {
                   attributes: {
                     email: user.email,
                     password: user.password
                   }
                 }
               }
        end.to change { user.reload.sign_in_count }.by(+1)
      end
    end

    context 'when invalid user data' do
      it 'returns serialized error for invalid password' do
        post :create,
             params: {
               data: {
                 attributes: {
                   email: user.email,
                   password: 'some-other-password'
                 }
               }
             }

        expect(response).to have_http_status(:unauthorized)

        document = JSON.parse(response.body)

        JSONAPI.parse_response!(document)

        error = document['errors'].first
        expect(error['title']).to eql('Invalid email or password')
      end

      it 'returns serialized error for invalid user' do
        post :create,
             params: {
               data: {
                 attributes: {
                   email: 'max@hax.dax',
                   password: user.password
                 }
               }
             }

        expect(response).to have_http_status(:unauthorized)

        document = JSON.parse(response.body)

        JSONAPI.parse_response!(document)

        error = document['errors'].first
        expect(error['title']).to eql('Invalid email or password')
      end

      it 'returns serialized error for unconfirmed user' do
        user = create(:user, :unconfirmed)

        post :create,
             params: {
               data: {
                 attributes: {
                   email: user.email,
                   password: user.password
                 }
               }
             }

        expect(response).to have_http_status(:unauthorized)

        document = JSON.parse(response.body)

        JSONAPI.parse_response!(document)

        error = document['errors'].first
        expect(error['title']).to eql('Email ist not confirmed')
      end

      it 'does not increment sign_in_count' do
        expect do
          post :create,
               params: {
                 data: {
                   attributes: {
                     email: 'max@hax.dax',
                     password: user.password
                   }
                 }
               }
        end.not_to(change { user.reload.sign_in_count })
      end
    end
  end

  describe 'GET #show' do
    it_behaves_like 'requires authentication' do
      let(:action) { -> { get :show } }
    end

    let(:user) { create(:user) }

    it 'returns serialized session' do
      Timecop.freeze do
        sign_in_user(user)

        get :show

        expect(response).to have_http_status(:ok)

        result = JSON.parse(response.body)

        JSONAPI.parse_response!(result)

        document = result.deep_symbolize_keys
        expire_after = document.dig(:data, :attributes, :'expire-after')
        user_id = document.dig(:data, :relationships, :user, :data, :id).to_i
        user_email = document.dig(:included, 0, :attributes, :email)
        user_first_name = document.dig(:included, 0, :attributes, :"first-name")
        user_last_name = document.dig(:included, 0, :attributes, :"last-name")

        expect(expire_after).to be_within(1).of(Devise.remember_for.to_i)
        expect(user_id).to eql(user.id)
        expect(user_email).to eql(user.email)
        expect(user_first_name).to eql(user.first_name)
        expect(user_last_name).to eql(user.last_name)
      end
    end

    it 'returns remaining session time' do
      travel_time = Random.rand(1..Devise.remember_for.to_i)

      Timecop.freeze do
        sign_in_user(user)

        Timecop.travel(travel_time) do
          get :show

          expect(response).to have_http_status(:ok)

          result = JSON.parse(response.body)

          document = result.deep_symbolize_keys
          expire_after = document.dig(:data, :attributes, :'expire-after')

          expect(expire_after).to be_within(1).of(Devise.remember_for.to_i - travel_time)
        end
      end
    end
  end
end
