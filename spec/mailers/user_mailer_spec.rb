# frozen_string_literal: true

require 'spec_helper'

describe(UserMailer) do
  after do
    MandrillMailer.deliveries.clear
  end

  describe '#welcome' do
    let(:user) { create(:user, :unconfirmed, confirmation_token: 'confirmation_token') }

    it 'sends localized mails' do
      I18n.available_locales.each do |locale|
        I18n.with_locale(locale) do
          mail = described_class.welcome(user)
          expect(mail.template_name).to eql("welcome-#{locale}")
        end
      end
    end

    it 'includes merge vars' do
      mail = described_class.welcome(user).deliver_now

      expect(mail.message['subject'])
        .to eql(I18n.t('mailers.user_mailer.welcome.subject'))
      expect(mail.message['to']).to eql([{ email: user.email, name: user.full_name }])

      merge_vars = mail.message['global_merge_vars'].each_with_object({}) do |obj, memo|
        memo[obj['name']] = obj['content']
      end
      expect(merge_vars).to eql(
        'FNAME' => user.first_name,
        'EMAIL_CONFIRMATION_LINK' => TeachUrl.confirmation_url('confirmation_token')
      )
    end

    it 'sends successfully' do
      expect do
        described_class.welcome(user).deliver_now
      end.to change { MandrillMailer.deliveries.count }.by(1)
    end

    describe 'logging' do
      it 'hides logging if SHOW_SENSITIVE_DATA_LOGS is not set' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', nil)

        mail = described_class.welcome(user)
        expect(mail.message['view_content_link']).to equal(false)
      end

      it 'keeps logging if SHOW_SENSITIVE_DATA_LOGS is set to 1' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', '1')

        mail = described_class.welcome(user)
        expect(mail.message['view_content_link']).to equal(true)
      end

      it 'keeps logging if SHOW_SENSITIVE_DATA_LOGS is set to true' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', 'true')

        mail = described_class.welcome(user)
        expect(mail.message['view_content_link']).to equal(true)
      end
    end
  end

  describe '#confirmation_instructions' do
    let(:user) do
      create(
        :user,
        confirmation_token: 'confirmation_token',
        unconfirmed_email: Faker::Internet.email
      )
    end

    it 'sends localized mails' do
      I18n.available_locales.each do |locale|
        I18n.with_locale(locale) do
          mail = described_class.confirmation_instructions(user)
          expect(mail.template_name).to eql("confirmation-instructions-#{locale}")
        end
      end
    end

    it 'includes merge vars' do
      mail = described_class.confirmation_instructions(user).deliver_now

      expect(mail.message['subject'])
        .to eql(I18n.t('mailers.user_mailer.confirmation_instructions.subject'))
      expect(mail.message['to']).to eql([{ email: user.unconfirmed_email, name: user.full_name }])

      merge_vars = mail.message['global_merge_vars'].each_with_object({}) do |obj, memo|
        memo[obj['name']] = obj['content']
      end
      expect(merge_vars).to eql(
        'FNAME' => user.first_name,
        'EMAIL_CONFIRMATION_LINK' => TeachUrl.confirmation_url('confirmation_token')
      )
    end

    it 'sends successfully' do
      expect do
        described_class.confirmation_instructions(user).deliver_now
      end.to change { MandrillMailer.deliveries.count }.by(1)
    end

    describe 'logging' do
      it 'hides logging if SHOW_SENSITIVE_DATA_LOGS is not set' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', nil)

        mail = described_class.confirmation_instructions(user)
        expect(mail.message['view_content_link']).to equal(false)
      end

      it 'keeps logging if SHOW_SENSITIVE_DATA_LOGS is set to 1' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', '1')

        mail = described_class.confirmation_instructions(user)
        expect(mail.message['view_content_link']).to equal(true)
      end

      it 'keeps logging if SHOW_SENSITIVE_DATA_LOGS is set to true' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', 'true')

        mail = described_class.confirmation_instructions(user)
        expect(mail.message['view_content_link']).to equal(true)
      end
    end
  end

  describe '#password_reset_link' do
    let(:user) { create(:user) }

    it 'sends localized mails' do
      I18n.available_locales.each do |locale|
        I18n.with_locale(locale) do
          mail = described_class.password_reset_link(user, 'token')
          expect(mail.template_name).to eql("password-reset-link-#{locale}")
        end
      end
    end

    it 'includes merge vars' do
      mail = described_class.password_reset_link(user, 'token').deliver_now

      expect(mail.message['subject'])
        .to eql(I18n.t('mailers.user_mailer.password_reset_link.subject'))
      expect(mail.message['to']).to eql([{ email: user.email, name: user.full_name }])

      merge_vars = mail.message['global_merge_vars'].each_with_object({}) do |obj, memo|
        memo[obj['name']] = obj['content']
      end
      expect(merge_vars).to eql(
        'FNAME' => user.first_name,
        'RESET_PASSWORD_LINK' => TeachUrl.password_reset_url('token')
      )
    end

    it 'sends successfully' do
      expect do
        described_class.password_reset_link(user, 'token').deliver_now
      end.to change { MandrillMailer.deliveries.count }.by(1)
    end

    describe 'logging' do
      it 'hides logging if SHOW_SENSITIVE_DATA_LOGS is not set' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', nil)

        mail = described_class.password_reset_link(user, 'token')
        expect(mail.message['view_content_link']).to equal(false)
      end

      it 'keeps logging if SHOW_SENSITIVE_DATA_LOGS is set to 1' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', '1')

        mail = described_class.password_reset_link(user, 'token')
        expect(mail.message['view_content_link']).to equal(true)
      end

      it 'keeps logging if SHOW_SENSITIVE_DATA_LOGS is set to true' do
        stub_const('UserMailer::SHOW_SENSITIVE_DATA_LOGS', 'true')

        mail = described_class.password_reset_link(user, 'token')
        expect(mail.message['view_content_link']).to equal(true)
      end
    end
  end

  describe '#password_reset_notification' do
    let(:user) { create(:user) }

    it 'sends localized mails' do
      I18n.available_locales.each do |locale|
        I18n.with_locale(locale) do
          mail = described_class.password_reset_notification(user)
          expect(mail.template_name).to eql("password-reset-notification-#{locale}")
        end
      end
    end

    it 'includes merge vars' do
      mail = described_class.password_reset_notification(user).deliver_now

      expect(mail.message['subject'])
        .to eql(I18n.t('mailers.user_mailer.password_reset_notification.subject'))
      expect(mail.message['to']).to eql([{ email: user.email, name: user.full_name }])

      merge_vars = mail.message['global_merge_vars'].each_with_object({}) do |obj, memo|
        memo[obj['name']] = obj['content']
      end
      expect(merge_vars).to eql(
        'FNAME' => user.first_name
      )
    end

    it 'sends successfully' do
      expect do
        described_class.password_reset_notification(user).deliver_now
      end.to change { MandrillMailer.deliveries.count }.by(1)
    end
  end

  describe '#email_changed_notification' do
    let(:user) do
      user = create(:user)
      user.update(email: Faker::Internet.email)
      user
    end

    it 'sends localized mails' do
      I18n.available_locales.each do |locale|
        I18n.with_locale(locale) do
          mail = described_class.email_changed_notification(user)
          expect(mail.template_name).to eql("email-change-notification-#{locale}")
        end
      end
    end

    it 'includes merge vars' do
      mail = described_class.email_changed_notification(user).deliver_now

      expect(mail.message['subject'])
        .to eql(I18n.t('mailers.user_mailer.email_changed_notification.subject'))
      expect(mail.message['to']).to eql([{ email: user.email, name: user.full_name }])

      merge_vars = mail.message['global_merge_vars'].each_with_object({}) do |obj, memo|
        memo[obj['name']] = obj['content']
      end
      expect(merge_vars).to eql(
        'FNAME' => user.first_name
      )
    end

    it 'sends successfully' do
      expect do
        described_class.email_changed_notification(user).deliver_now
      end.to change { MandrillMailer.deliveries.count }.by(1)
    end
  end
end
