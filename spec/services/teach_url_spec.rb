# frozen_string_literal: true

require 'spec_helper'

describe TeachUrl do
  describe '#root_url' do
    it 'returns teach root_url' do
      expect(described_class.root_url).to eql('https://teach.appcamps.test')
    end
  end

  describe '#registration_url' do
    it 'returns teach registration_url' do
      expect(described_class.registration_url).to eql('https://teach.appcamps.test/registration')
    end
  end

  describe '#password_reset_request_url' do
    it 'returns teach password_reset_request_url' do
      expect(described_class.password_reset_request_url)
        .to eql('https://teach.appcamps.test/password-reset')
    end
  end

  describe '#password_reset_url' do
    it 'returns teach password_reset_url' do
      expect(described_class.password_reset_url('token'))
        .to eql('https://teach.appcamps.test/password-reset/token')
    end

    it 'throws on invalid token type' do
      expect { described_class.password_reset_url(nil) }
        .to raise_error(TeachUrl::InvalidArgumentTypeError)
    end
  end

  describe '#confirmation_url' do
    it 'returns teach confirmation_url' do
      expect(described_class.confirmation_url('token'))
        .to eql('https://teach.appcamps.test/email-confirmation/token')
    end

    it 'throws on invalid token type' do
      expect { described_class.confirmation_url(nil) }
        .to raise_error(TeachUrl::InvalidArgumentTypeError)
    end
  end
end
