# frozen_string_literal: true

require 'spec_helper'

describe Api::PasswordResetController do
  before do
    set_json_api_content_type
  end

  after do
    MandrillMailer.deliveries.clear
  end

  describe 'POST #create' do
    it 'sends german password recovery email to user' do
      user = create(:user)

      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: user.email } } }
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      expect(response).to have_http_status(:accepted)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('password-reset-link-de')
      expect(mail.message['to'][0])
        .to eql(email: user.email, name: user.full_name)
    end

    it 'sends not send an email but still return accepted' do
      expect do
        post :create, params: { data: { attributes: { email: Faker::Internet.email } } }
      end.not_to(change { MandrillMailer.deliveries.count })

      expect(response).to have_http_status(:accepted)
    end
  end

  describe 'PATCH #update' do
    it 'changes password and send german password recovery email to user' do
      user = create(:user)
      token = user.send(:set_reset_password_token)
      new_password = Faker::Internet.password

      expect do
        perform_enqueued_jobs do
          patch :update,
                params: {
                  reset_password_token: token,
                  data: {
                    attributes: {
                      password: new_password,
                      password_confirmation: new_password
                    }
                  }
                }
        end
      end.to(change { MandrillMailer.deliveries.count }.by(1))

      expect(response).to have_http_status(:no_content)

      expect(user.reload.valid_password?(new_password)).to be(true)
      expect(user.reset_password_token).to be(nil)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('password-reset-notification-de')
      expect(mail.message['to'][0]).to eql(email: user.email, name: user.full_name)
    end

    it 'returns error if passwords don\'t match' do
      user = create(:user)
      token = user.send(:set_reset_password_token)

      expect do
        patch :update,
              params: {
                reset_password_token: token,
                data: {
                  attributes: {
                    password: '1234',
                    password_confirmation: '123'
                  }
                }
              }
      end.not_to(change { MandrillMailer.deliveries.count })

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body)
      expect(result['errors'][0]).to eql(
        'detail' => 'doesn\'t match Password',
        'source' => { 'pointer' => '/data/attributes/password-confirmation' }
      )
    end

    it 'returns error if passwords are too short' do
      user = create(:user)
      token = user.send(:set_reset_password_token)

      expect do
        patch :update,
              params: {
                reset_password_token: token,
                data: {
                  attributes: {
                    password: '1234',
                    password_confirmation: '1234'
                  }
                }
              }
      end.not_to(change { MandrillMailer.deliveries.count })

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body)
      expect(result['errors'][0]).to eql(
        'detail' => 'is too short (minimum is 8 characters)',
        'source' => { 'pointer' => '/data/attributes/password' }
      )
    end

    it 'returns error if token is exired' do
      user = create(:user)
      token = user.send(:set_reset_password_token)

      Timecop.travel(Devise.reset_password_within + 1.day) do
        expect do
          patch :update,
                params: {
                  reset_password_token: token,
                  data: {
                    attributes: {
                      password: '12345678',
                      password_confirmation: '12345678'
                    }
                  }
                }
        end.not_to(change { MandrillMailer.deliveries.count })
      end

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body)
      expect(result['errors'][0]).to eql(
        'detail' => 'has expired, please request a new one',
        'source' => { 'pointer' => '/data/attributes/reset-password-token' }
      )
    end

    it 'returns error if token is invalid' do
      expect do
        patch :update,
              params: {
                reset_password_token: '12345',
                data: {
                  attributes: {
                    password: '1234',
                    password_confirmation: '1234'
                  }
                }
              }
      end.not_to(change { MandrillMailer.deliveries.count })

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body)
      expect(result['errors'][0]).to eql(
        'detail' => 'is invalid',
        'source' => { 'pointer' => '/data/attributes/reset-password-token' }
      )
    end
  end
end
