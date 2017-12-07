# frozen_string_literal: true

require 'spec_helper'

describe MailchimpNewsletterSubscribeJob do
  describe '#perform' do
    let(:user) { create(:user) }
    let(:headers) do
      {
        'Accept' => '*/*',
        'Accept-Encoding' => 'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
        'Authorization' => "Basic #{Base64.encode64("apikey:#{ENV['MAILCHIMP_API_KEY']}").strip}",
        'Content-Type' => 'application/json',
        'User-Agent' => Faraday.default_connection.headers['User-Agent']
      }
    end

    def md5(string)
      Digest::MD5.hexdigest(string)
    end

    it 'makes an upsert request to the mailchimp api with given user + email' do
      stub_request(
        :put,
        "https://us9.api.mailchimp.com/3.0/lists/list_id/members/#{md5(user.email)}"
      ).with(
        body: JSON.dump(
          email_address: user.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: user.first_name,
            LNAME: user.last_name
          }
        ),
        headers: headers
      ).to_return(status: 200, body: '', headers: {})

      described_class.new.perform(user.id)
    end

    it 'lowercases email for md5 hash' do # rubocop:disable RSpec/ExampleLength
      user.skip_reconfirmation!
      user.update(email: 'TEST@TEST.DE')

      stub_request(
        :put,
        "https://us9.api.mailchimp.com/3.0/lists/list_id/members/#{md5('test@test.de')}"
      ).with(
        body: JSON.dump(
          email_address: 'test@test.de',
          status: 'subscribed',
          merge_fields: {
            FNAME: user.first_name,
            LNAME: user.last_name
          }
        ),
        headers: headers
      )
        .to_return(status: 200, body: '', headers: {})

      described_class.new.perform(user.id)
    end

    it 'updates email with old for md5 hash' do # rubocop:disable RSpec/ExampleLength
      old_email = user.email
      new_email = Faker::Internet.email

      user.skip_reconfirmation!
      user.update(email: new_email)

      stub_request(
        :put,
        "https://us9.api.mailchimp.com/3.0/lists/list_id/members/#{md5(old_email)}"
      ).with(
        body: JSON.dump(
          email_address: new_email,
          status: 'subscribed',
          merge_fields: {
            FNAME: user.first_name,
            LNAME: user.last_name
          }
        ),
        headers: headers
      ).to_return(status: 200, body: '', headers: {})

      described_class.new.perform(user.id, old_email)
    end
  end
end
