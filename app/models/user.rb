# frozen_string_literal: true

class User < ApplicationRecord
  LAST_PRIVACY_POLICY_UPDATE =
    Time.zone.at(Rails.application.secrets.last_privacy_policy_update_at)

  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable, :timeoutable

  attr_accessor :validate_privacy_policy_accepted,
                :validate_referal_on_api_signup,
                :validate_password_confirmation

  enum role: {
    role_teacher: 0,
    role_course_instructor: 1,
    role_custom: 2
  }

  has_one :current_locality,
          -> { order(created_at: :desc) },
          class_name: Locality.to_s

  has_many :localities, dependent: :destroy
  has_many :school_classes, dependent: :destroy

  # validations by devise:
  # validates_presence_of   :email, if: :email_required?
  # validates_uniqueness_of :email, allow_blank: true, if: :email_changed?
  # validates_format_of     :email, with: email_regexp, allow_blank: true, if: :email_changed?
  # validates_presence_of     :password, if: :password_required?
  # validates_confirmation_of :password, if: :password_required?
  # validates_length_of       :password, within: password_length, allow_blank: true

  validates :first_name, :last_name, :role,
            presence: true

  validates :email, :first_name, :last_name, :role_custom, :subjects,
            length: { maximum: 255 }

  validates :role_custom,
            absence: { unless: -> { role_custom? } },
            presence: { if: -> { role_custom? } }

  validates :privacy_policy_accepted,
            acceptance: { accept: true },
            if: :validate_privacy_policy_accepted

  validates :referal, presence: true, if: :validate_referal_on_api_signup

  validates :password_confirmation, presence: true, if: :validate_password_confirmation

  before_save :set_full_name

  def privacy_policy_accepted
    (privacy_policy_accepted_at.present? &&
      privacy_policy_accepted_at >= LAST_PRIVACY_POLICY_UPDATE)
  end

  def privacy_policy_accepted=(policy_accepted)
    return if !policy_accepted || privacy_policy_accepted
    self.privacy_policy_accepted_at = Time.zone.now
  end

  def unread_posts_present?
    last_post_updated_at = Post.last_updated_at
    return false if last_post_updated_at.nil?

    last_posts_read_at.nil? || last_post_updated_at > last_posts_read_at
  end

  def unread_posts_present=(unread_posts_present)
    return unless unread_posts_present?
    self.last_posts_read_at = Time.zone.now unless unread_posts_present
  end

  def intercom_hash
    OpenSSL::HMAC.hexdigest(
      'sha256',
      Rails.application.secrets.intercom_secret_key, id.to_s
    )
  end

  # devise overwrites
  DeviseEmailNotOverwrittenError = Class.new(StandardError)

  def send_devise_notification(*args)
    super(*args)
    raise DeviseEmailNotOverwrittenError, "Devise Mailer was used for notification: \"#{args[0]}\""
  rescue DeviseEmailNotOverwrittenError => error
    Rollbar.error(error)
  end

  def after_confirmation
    MailchimpNewsletterSubscribeJob.perform_later(id)
  end

  def send_welcome_email
    I18n.with_locale(:de) do
      UserMailer.welcome(self).deliver_later
    end
  end

  def send_confirmation_instructions
    generate_confirmation_token! unless @raw_confirmation_token

    I18n.with_locale(:de) do
      UserMailer.confirmation_instructions(self).deliver_later
    end
  end

  def send_reset_password_instructions_notification(token)
    I18n.with_locale(:de) do
      UserMailer.password_reset_link(self, token).deliver_later
    end
  end

  def send_password_change_notification
    I18n.with_locale(:de) do
      UserMailer.password_reset_notification(self).deliver_later
    end
  end

  def send_email_changed_notification
    I18n.with_locale(:de) do
      UserMailer.email_changed_notification(self).deliver_later
    end
  end

  private

  def set_full_name
    self.full_name = [first_name, last_name].join(' ')
  end
end
