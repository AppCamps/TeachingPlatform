# frozen_string_literal: true

# rubocop:disable Metrics/MethodLength

class UserMailer < BaseMailer
  # don't save email contents with sensitive data at mandrill
  SHOW_SENSITIVE_DATA_LOGS = (ENV['SHOW_SENSITIVE_DATA_LOGS'] || false).freeze

  def welcome(user)
    template_name = "welcome-#{I18n.locale}"

    mandrill_mail(
      template: template_name,
      subject: I18n.t('mailers.user_mailer.welcome.subject'),
      to: { email: user.email, name: user.full_name },
      vars: {
        'FNAME' => user.first_name,
        'EMAIL_CONFIRMATION_LINK' => TeachUrl.confirmation_url(user.confirmation_token)
      },
      view_content_link: SHOW_SENSITIVE_DATA_LOGS
    )
  end

  def confirmation_instructions(user)
    template_name = "confirmation-instructions-#{I18n.locale}"
    email = user.unconfirmed_email || user.email

    mandrill_mail(
      template: template_name,
      subject: I18n.t('mailers.user_mailer.confirmation_instructions.subject'),
      to: { email: email, name: user.full_name },
      vars: {
        'FNAME' => user.first_name,
        'EMAIL_CONFIRMATION_LINK' => TeachUrl.confirmation_url(user.confirmation_token)
      },
      view_content_link: SHOW_SENSITIVE_DATA_LOGS
    )
  end

  def password_reset_link(user, reset_token)
    template_name = "password-reset-link-#{I18n.locale}"

    mandrill_mail(
      template: template_name,
      subject: I18n.t('mailers.user_mailer.password_reset_link.subject'),
      to: { email: user.email, name: user.full_name },
      vars: {
        'FNAME' => user.first_name,
        'RESET_PASSWORD_LINK' => TeachUrl.password_reset_url(reset_token)
      },
      view_content_link: SHOW_SENSITIVE_DATA_LOGS
    )
  end

  def password_reset_notification(user)
    template_name = "password-reset-notification-#{I18n.locale}"

    mandrill_mail(
      template: template_name,
      subject: I18n.t('mailers.user_mailer.password_reset_notification.subject'),
      to: { email: user.email, name: user.full_name },
      vars: {
        'FNAME' => user.first_name
      },
      view_content_link: true
    )
  end

  def email_changed_notification(user)
    raise StandardError, 'email_before_last_save is nil' unless user.email_before_last_save

    template_name = "email-change-notification-#{I18n.locale}"

    mandrill_mail(
      template: template_name,
      subject: I18n.t('mailers.user_mailer.email_changed_notification.subject'),
      to: { email: user.email_before_last_save, name: user.full_name },
      vars: {
        'FNAME' => user.first_name
      },
      view_content_link: true
    )
  end
end
