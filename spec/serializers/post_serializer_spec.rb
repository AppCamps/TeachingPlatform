# frozen_string_literal: true

require 'spec_helper'

describe PostSerializer do
  let(:post) { build(:post) }
  let(:serializer_instance) do
    described_class.new(post)
  end

  %i[
    title content pinned
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      expect(serializer_instance.serializable_hash)
        .to have_key(attribute_name)
      expect(serializer_instance.serializable_hash[attribute_name])
        .to eql(post.send(attribute_name))
    end
  end

  describe '#released_at' do
    it 'returns nil if not set' do
      post.released_at = nil

      expect(serializer_instance.serializable_hash[:released_at]).to be(nil)
    end

    it 'returns iso8601 if time is set' do
      Timecop.freeze do
        post.released_at = Time.zone.now

        expect(serializer_instance.serializable_hash[:released_at]).to eql(Time.zone.now.iso8601)
      end
    end
  end

  describe '#teaser_image' do
    let(:post) { build(:post, :with_teaser_image) }

    it 'returns nil if url is image ist not present' do
      post.teaser_image = nil

      expect(serializer_instance.serializable_hash[:teaser_image_url]).to be(nil)
    end

    it 'returns teaser_image url if image is present' do
      expect(serializer_instance.serializable_hash[:teaser_image_url]).not_to eql(nil)
    end
  end
end
