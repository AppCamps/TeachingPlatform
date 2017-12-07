# frozen_string_literal: true

require 'spec_helper'

describe 'Request throttling', type: :request do
  before do
    host! 'teach.appcamps.test'
  end

  describe 'api' do
    let(:jsonapi_headers) { { headers: { 'Content-Type' => Mime[:jsonapi].to_s, format: :json } } }

    it 'throttles requests to the api' do
      10.times do
        get '/api/courses', jsonapi_headers
        expect(response.status).to be(401)
      end

      get '/api/courses', jsonapi_headers
      expect(response.status).to be(429)
    end

    def create_login_params
      {
        data: {
          type: 'sessions',
          id: 'undefined',
          attributes: {
            email: Faker::Internet.email,
            password: Faker::Internet.password
          }
        }
      }.to_json
    end

    it 'throttles login requests by ip' do
      5.times do
        post '/api/session', jsonapi_headers.merge(params: create_login_params)
        expect(response.status).to be(401)
      end

      post '/api/session', jsonapi_headers.merge(params: create_login_params)
      expect(response.status).to be(429)
    end

    it 'throttles login requests by email param' do
      login_params = { params: create_login_params }

      5.times do
        allow_any_instance_of(Rack::Attack::Request)
          .to receive(:ip) { Faker::Internet.ip_v4_address }

        post '/api/session', jsonapi_headers.merge(login_params)
        expect(response.status).to be(401)
      end

      post '/api/session', jsonapi_headers.merge(login_params)
      expect(response.status).to be(429)
    end
  end

  it 'throttles requests to application' do
    15.times do
      get '/'
      expect(response.status).to be(200)
    end

    get '/'
    expect(response.status).to be(429)
  end
end
