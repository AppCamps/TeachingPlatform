# frozen_string_literal: true

class Post < ApplicationRecord
  include PostUploader[:teaser_image]
  paginates_per 10

  def self.last_updated_at
    Post.order(updated_at: :desc).first.try(:updated_at)
  end
end
