# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::CountriesController, api: :authenticate do
  let(:user) { create(:user) }

  before do
    set_json_api_content_type
    sign_in_user(user)
  end

  describe 'GET #index' do
    it_behaves_like 'requires authentication' do
      let(:action) { -> { get :index } }
    end

    it 'returns serialized countries' do
      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      countries = document[:data]

      available_countries = CountryService.all
      expect(countries.length).to eql(available_countries.count)
      expect(document[:included]).not_to be

      countries.each do |country_data|
        country = CountryService.new(country_data[:id])

        expect(country_data.dig(:attributes, :name))
          .to eql(country.name)
        expect(country_data.dig(:attributes, :states))
          .to eql(country.states.transform_keys(&:downcase))
        expect(country_data.dig(:attributes, :"postal-code-format"))
          .to eql(country.postal_code_format.inspect)
      end
    end
  end
end
