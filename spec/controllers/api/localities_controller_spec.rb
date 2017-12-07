# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::LocalitiesController, api: :authenticate do
  let(:current_user) { create(:user) }

  before do
    set_json_api_content_type
    sign_in_user(current_user)
  end

  describe 'POST #create' do
    let(:locality_attributes) do
      attributes_for(:locality, user: current_user).except(:user).merge(subjects: 'Hauswirtschaft')
    end

    it 'creates locality with values for current_user and sets subjects on user' do
      params = locality_attributes.stringify_keys.transform_keys { |key| key.downcase.dasherize }
      post :create,
           params: {
             data: {
               attributes: params
             }
           }

      result = JSON.parse(response.body).deep_symbolize_keys
      expect(response).to have_http_status(:created)

      current_user.reload

      expect(current_user.subjects).to eql(locality_attributes[:subjects])
      expect(current_user.current_locality).to be

      locality = current_user.current_locality
      expect(locality.country).to eql(locality_attributes[:country])
      locality_attributes.except(:country, :subjects).each do |key, value|
        expect(locality.send(key)).to eql(value)
      end

      attrs_result = result.dig(:data, :attributes).except(:country)
      expect(attrs_result)
        .to(
          eql(
            locality_attributes
              .except(:country)
              .deep_transform_keys { |k| k.to_s.dasherize.to_sym }
          )
        )
      expect(result.dig(:data, :attributes, :country)).to eql(locality_attributes[:country].to_s)

      locality_id = result.dig(:included, 0, :relationships, :locality, :data, :id)
      expect(locality_id).to eql(locality.id)
    end

    it 'does not update locality on user error' do
      invalid_attributes = locality_attributes.merge(country: :country_de, postal_code: 'xyz')

      post :create,
           params: {
             data: {
               attributes: invalid_attributes.stringify_keys.transform_keys(&:dasherize)
             }
           }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(current_user.reload.subjects).not_to eql(locality_attributes[:subjects])
    end

    it 'renders locality errors' do
      invalid_attributes = locality_attributes.merge(country: :country_de, postal_code: 'xyz')

      post :create,
           params: {
             data: {
               attributes: invalid_attributes.stringify_keys.transform_keys(&:dasherize)
             }
           }

      result = JSON.parse(response.body).deep_symbolize_keys
      expect(response).to have_http_status(:unprocessable_entity)

      expect(result[:errors])
        .to include(source: {
                      pointer: '/data/attributes/postal-code'
                    },
                    detail: 'invalid postal code')
    end

    it 'renders country errors' do
      invalid_attributes = locality_attributes.merge(country: :xyz)

      post :create,
           params: {
             data: {
               attributes: invalid_attributes.stringify_keys.transform_keys(&:dasherize)
             }
           }

      result = JSON.parse(response.body).deep_symbolize_keys
      expect(response).to have_http_status(:unprocessable_entity)

      expect(result[:errors]).to(
        include(
          source: { pointer: '/data/attributes/country' },
          detail: 'is not a valid country'
        )
      )
    end
  end
end
