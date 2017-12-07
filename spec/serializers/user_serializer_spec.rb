# frozen_string_literal: true

require 'spec_helper'

describe UserSerializer do
  let(:user) { build(:user) }
  let(:serializer_instance) do
    described_class.new(user)
  end

  %i[
    email unconfirmed_email first_name intercom_hash privacy_policy_accepted
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash)
        .to have_key(attribute_name.to_sym)
      expect(serializer_instance.serializable_hash[attribute_name])
        .to eql(user.send(attribute_name))
    end
  end

  describe '#unread_posts_present' do
    it 'serializes object.unread_posts_present?' do
      Timecop.freeze do
        expect(serializer_instance.serializable_hash[:unread_posts_present])
          .to eq(user.unread_posts_present?)
      end
    end
  end

  describe '#created_at' do
    it 'serializes created_at as timestamp' do
      Timecop.freeze do
        user.save

        expect(serializer_instance.serializable_hash[:created_at])
          .to eql(Time.zone.now.to_i)
      end
    end
  end

  describe '#locality' do
    it 'serializes locality if current_locality is present' do
      user = create(:user, current_locality: nil)

      expect(serializer_instance.serializable_hash[:locality]).to be(nil)

      user.current_locality = create(:locality, user: user)
      expect(described_class.new(user).serializable_hash[:locality])
        .to eql(LocalitySerializer.new(user.current_locality).serializable_hash.except(:user))
    end
  end

  describe '#teacher' do
    it 'serializes teacher if role == \'role_teacher\'' do
      user = create(:user, role: :role_teacher)
      expect(described_class.new(user).serializable_hash[:teacher]).to be(true)

      user = create(:user, role: :role_course_instructor)
      expect(described_class.new(user).serializable_hash[:teacher]).to be(false)
    end
  end
end
