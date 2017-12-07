# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::ConfirmationsController do
  before do
    set_json_api_content_type
  end

  after do
    MandrillMailer.deliveries.clear
  end

  describe 'POST #create' do
    it 'resends german welcome email to unconfirmed user' do
      user = create(:user, :unconfirmed)

      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: user.email } } }
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      expect(response).to have_http_status(:accepted)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('welcome-de')
      expect(mail.message['to'][0])
        .to eql(email: user.email, name: user.full_name)
    end

    it 'sends german confirmation instructions to confirmed user with pending confirmation' do
      user = create(:user, :unconfirmed)
      # Confirm user
      user.confirm

      # Require email change confirmation
      user.update(email: 'test@appcamps.com')

      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: user.email } } }
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      expect(response).to have_http_status(:accepted)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('confirmation-instructions-de')
      expect(mail.message['to'][0])
        .to eql(email: 'test@appcamps.com', name: user.full_name)
    end

    it 'sends not send an email but still return accepted for invalid email' do
      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: Faker::Internet.email } } }
        end
      end.not_to(change { MandrillMailer.deliveries.count })

      expect(response).to have_http_status(:accepted)
    end

    it 'sends not send an email but still return accepted for already confirmed user' do
      user = create(:user, :unconfirmed)
      user.confirm

      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: user.email } } }
        end
      end.not_to(change { MandrillMailer.deliveries.count })

      expect(response).to have_http_status(:accepted)
    end

    it 'sends an email to new email for user with unconfirmed_email' do
      user = create(:user, :unconfirmed)
      user.confirm

      new_email = Faker::Internet.email
      user.update(email: new_email)

      expect(user.reload.unconfirmed_email).to eql(new_email)
      expect(user.email).not_to eql(new_email)

      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: user.email } } }
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.message['to'][0]).to eql(email: new_email, name: user.full_name)
      expect(response).to have_http_status(:accepted)
    end

    it 'sends an email to new email for user with unconfirmed_email (lookup by new email)' do
      user = create(:user, :unconfirmed)
      user.confirm

      new_email = Faker::Internet.email
      user.update(email: new_email)

      expect(user.reload.unconfirmed_email).to eql(new_email)
      expect(user.email).not_to eql(new_email)

      expect do
        perform_enqueued_jobs do
          post :create, params: { data: { attributes: { email: new_email } } }
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.message['to'][0]).to eql(email: new_email, name: user.full_name)
      expect(response).to have_http_status(:accepted)
    end
  end

  describe 'PATCH #update' do
    it 'confirms user, enqueue newsletter update job and keep confirmation_token' do
      user = create(:user, :unconfirmed)
      token = user.confirmation_token

      expect do
        patch :update, params: { confirmation_token: token, data: {} }
      end.to change { queue_adapter.enqueued_jobs.count }.by(+1)

      expect(response).to have_http_status(:ok)

      user.reload

      expect(user.confirmed?).to be(true)
      expect(user.confirmation_token).to eql(token)

      job = queue_adapter.enqueued_jobs.last
      expect(job[:job]).to eql(MailchimpNewsletterSubscribeJob)
    end

    it 'returns error if token is exired' do
      user = create(:user, :unconfirmed)
      token = user.confirmation_token

      Timecop.travel(Devise.confirm_within + 1.day) do
        patch :update, params: { confirmation_token: token, data: {} }

        expect(response).to have_http_status(:unprocessable_entity)

        result = JSON.parse(response.body)
        expect(result['errors'][0]).to eql(
          'detail' => 'needs to be confirmed within 3 months, please request a new one',
          'source' => { 'pointer' => '/data/attributes/email' }
        )
      end
    end

    it 'returns error if token is invalid' do
      patch :update, params: { confirmation_token: '12345', data: {} }

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body)
      expect(result['errors'][0]).to eql(
        'detail' => 'is invalid',
        'source' => { 'pointer' => '/data/attributes/confirmation-token' }
      )
    end

    it 'returns error if user is already confirmed' do
      user = create(:user)
      user.send_confirmation_instructions

      patch :update, params: { confirmation_token: user.confirmation_token, data: {} }

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body)
      expect(result['errors'][0]).to eql(
        'detail' => 'was already confirmed, please try signing in',
        'source' => { 'pointer' => '/data/attributes/email' }
      )
    end
  end
end
