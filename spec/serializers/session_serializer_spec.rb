# frozen_string_literal: true

require 'spec_helper'

describe SessionSerializer do
  let(:session) { Session.new(expire_after: 123, user: build(:user)) }
  let(:serializer_instance) do
    described_class.new(session)
  end

  %i[
    expire_after
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash[attribute_name])
        .to equal(session.send(attribute_name))
    end
  end

  it 'serializes user' do
    expect(UserSerializer.new(session.user).serializable_hash)
      .to include(serializer_instance.serializable_hash[:user])
  end
end
