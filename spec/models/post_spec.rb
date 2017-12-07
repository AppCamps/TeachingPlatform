# frozen_string_literal: true

require 'spec_helper'

describe Post do
  describe '#self.last_updated_at' do
    it 'returns updated_at of last updated model' do
      Timecop.freeze do
        first_post = create(:post)
        expect(described_class.last_updated_at).to be_within(1).of(first_post.updated_at)

        Timecop.travel(1.week.from_now)

        second_post = create(:post)
        expect(described_class.last_updated_at).to be_within(1).of(second_post.updated_at)
      end
    end
  end
end
