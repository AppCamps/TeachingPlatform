# frozen_string_literal: true

module Api
  class CountriesController < ApiController
    def index
      I18n.with_locale :de do
        countries = CountryService.all
        render json: countries, status: :ok,
               each_serializer: CountrySerializer
      end
    end
  end
end
