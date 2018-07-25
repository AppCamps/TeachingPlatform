# frozen_string_literal: true

class MailchimpNewsletterSubscribeJob < ApplicationJob
  NEWSLETTER_ID = fetch_from_env('MAILCHIMP_NEWSLETTER_LIST_ID')

  def perform(user_id, old_email = nil)
    user = User.find(user_id)

    gibbon
      .lists(NEWSLETTER_ID)
      .members(email_hash(old_email || user.email))
      .upsert(
        body: {
          email_address: user.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: user.first_name,
            LNAME: user.last_name
          }
        }
      )
  end

  private

  def gibbon
    api_key = Rails.application.secrets.mailchimp_api_key
    Gibbon::Request.new(api_key: api_key, debug: Rails.env.development?)
  end

  def email_hash(email)
    Digest::MD5.hexdigest(email)
  end
end
