# frozen_string_literal: true

require 'spec_helper'

describe User do
  describe 'enums' do
    it do
      is_expected.to define_enum_for(:role).with(
        role_teacher: 0,
        role_course_instructor: 1,
        role_custom: 2
      )
    end
  end

  describe 'relations' do
    it { is_expected.to have_many(:school_classes) }
    it { is_expected.to have_one(:current_locality) }
    it { is_expected.to have_many(:localities) }
  end

  describe 'validations' do
    presence_validation_attributes =
      %i[email first_name last_name role]
    presence_validation_attributes.each do |attribute|
      it { is_expected.to validate_presence_of(attribute) }
    end

    describe 'privacy_policy_accepted' do
      it do
        user = build(:user, :without_accepted_privacy_policy)
        user.validate_privacy_policy_accepted = true
        expect(user).to validate_acceptance_of(:privacy_policy_accepted)
      end

      it { is_expected.not_to validate_acceptance_of(:privacy_policy_accepted) }
    end

    describe 'referal' do
      it do
        user = build(:user)
        user.validate_referal_on_api_signup = true
        expect(user).to validate_presence_of(:referal)
      end

      it { is_expected.not_to validate_presence_of(:referal) }
    end

    length_validation_attributes =
      %i[email first_name last_name role_custom subjects]
    length_validation_attributes.each do |attribute|
      it { is_expected.to validate_length_of(attribute).is_at_most(255) }
    end

    it { is_expected.to validate_presence_of(:password).on(:create) }
    it do
      user = build(:user)
      user.validate_password_confirmation = true
      expect(user)
        .to(validate_presence_of(:password))
      expect(user)
        .to(validate_presence_of(:password_confirmation))
    end

    describe 'role_custom' do
      it 'has to be present if role == role_custom' do
        expect(build(:user, role: 'role_custom'))
          .to(validate_presence_of(:role_custom))
      end

      it 'has to be absent if role != role_custom' do
        expect(build(:user, role: 'role_teacher'))
          .to(validate_absence_of(:role_custom))
      end
    end
  end

  describe '#full_name' do
    it 'joins first_name and last_name on save' do
      user = build(:user)
      expect(user.full_name).to be_nil

      user.save!
      expect(user.full_name).to eql("#{user.first_name} #{user.last_name}")
    end
  end

  describe '#intercom_hash' do
    it 'creates intercom user_hash' do
      allow(Rails.application.secrets)
        .to receive(:intercom_secret_key).and_return('secret_key')

      user = create(:user)

      intercom_hash = OpenSSL::HMAC.hexdigest('sha256', 'secret_key', user.id.to_s)

      expect(user.intercom_hash)
        .to eql(intercom_hash)
    end
  end

  describe '#privacy_policy_accepted' do
    let(:user) { create(:user) }

    it 'returns true privacy_policy_accepted_at is same as User::LAST_PRIVACY_POLICY_UPDATE' do
      Timecop.freeze do
        user.update(privacy_policy_accepted_at: User::LAST_PRIVACY_POLICY_UPDATE)

        expect(user.privacy_policy_accepted)
          .to be(true)
      end
    end

    it 'returns true privacy_policy_accepted_at is greater than as User::LAST_PRIVACY_POLICY_UPDATE' do # rubocop:disable LineLength
      Timecop.freeze do
        user.update(privacy_policy_accepted_at: User::LAST_PRIVACY_POLICY_UPDATE + 1.day)

        expect(user.privacy_policy_accepted)
          .to be(true)
      end
    end

    it 'returns false privacy_policy_accepted_at is lower than as User::LAST_PRIVACY_POLICY_UPDATE' do # rubocop:disable LineLength
      Timecop.freeze do
        user.update(privacy_policy_accepted_at: User::LAST_PRIVACY_POLICY_UPDATE - 1.second)

        expect(user.privacy_policy_accepted)
          .to be(false)
      end
    end
  end

  describe '#unread_posts_present?' do
    context 'when last_updated_at is nil' do
      let(:user) { build(:user, last_posts_read_at: nil) }

      it 'returns false if Post.last_updated_at is nil' do
        expect(Post).to receive(:last_updated_at).and_return(nil)
        expect(user.unread_posts_present?).to be(false)
      end

      it 'returns true if Post.last_updated_at is present' do
        expect(Post).to receive(:last_updated_at).and_return(Time.zone.now)
        expect(user.unread_posts_present?).to be(true)
      end
    end

    context 'when last_updated_at is set' do
      let(:user) { build(:user, last_posts_read_at: Time.zone.now) }

      it 'returns false Post.last_updated_at is older' do
        expect(Post).to receive(:last_updated_at).and_return(1.week.ago)
        expect(user.unread_posts_present?).to be(false)
      end

      it 'returns true if Post.last_updated_at is newer' do
        expect(Post).to receive(:last_updated_at).and_return(1.week.from_now)
        expect(user.unread_posts_present?).to be(true)
      end
    end
  end

  describe '#unread_posts_present=' do
    let(:user) { build(:user, last_posts_read_at: nil) }

    context 'when unread_posts_present? is true' do
      it 'returns sets last_posts_read_at to Time.zone.now if set to false' do
        Timecop.freeze do
          expect(user).to receive(:unread_posts_present?).and_return(true)

          user.unread_posts_present = false

          expect(user.last_posts_read_at).to eql(Time.zone.now)
        end
      end

      it 'returns does nothing when unread_posts_present if set to true' do
        expect(user).to receive(:unread_posts_present?).and_return(true)

        user.unread_posts_present = true

        expect(user.last_posts_read_at).to be(nil)
      end
    end

    context 'when unread_posts_present? is true' do
      it 'does nothing' do
        expect(user).to receive(:unread_posts_present?).twice.and_return(false)

        user.unread_posts_present = true
        expect(user.last_posts_read_at).to be(nil)

        user.unread_posts_present = false
        expect(user.last_posts_read_at).to be(nil)
      end
    end
  end

  describe '#send_welcome_email' do
    it 'sends welcome email' do
      user = create(:user, :unconfirmed)

      expect do
        perform_enqueued_jobs { user.send_welcome_email }
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('welcome-de')
    end
  end

  describe 'devise overwrites' do
    after do
      MandrillMailer.deliveries.last
    end

    describe 'error tracking for missing overwrite' do
      it 'sends error to rollbar for not overwritten emails' do
        user = create(:user, :unconfirmed)
        error = nil
        expect(Rollbar).to receive(:error) { |argument| error = argument }

        expect do
          perform_enqueued_jobs do
            user.send_devise_notification(:email_changed, {})
          end
        end.not_to(change { MandrillMailer.deliveries.count })

        expect(error).to be_a(User::DeviseEmailNotOverwrittenError)
        expect(error.message).to eql('Devise Mailer was used for notification: "email_changed"')
      end
    end

    it 'overwrites send_confirmation_instructions' do
      user = create(:user)

      expect do
        perform_enqueued_jobs do
          user.send_confirmation_instructions
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('confirmation-instructions-de')
    end

    it 'overwrites send_reset_password_instructions' do
      user = create(:user)

      expect do
        perform_enqueued_jobs do
          user.send_reset_password_instructions
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('password-reset-link-de')
    end

    it 'overwrites send_password_change_notification' do
      user = create(:user)

      expect do
        perform_enqueued_jobs do
          user.send_password_change_notification
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('password-reset-notification-de')
    end

    it 'overwrites send_email_changed_notification' do
      user = create(:user)

      # change email so email_attribute_before_save is defined
      user.update(email: Faker::Internet.email)

      expect do
        perform_enqueued_jobs do
          user.send_email_changed_notification
        end
      end.to change { MandrillMailer.deliveries.count }.by(1)

      mail = MandrillMailer.deliveries.last
      expect(mail.template_name).to eql('email-change-notification-de')
    end

    it 'subscribes email with mailchimp after_confirmation' do
      user = create(:user)
      user.update(email: Faker::Internet.email)

      expect(MailchimpNewsletterSubscribeJob)
        .to receive(:perform_later).with(user.id)

      user.confirm
    end
  end
end
