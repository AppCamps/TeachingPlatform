# frozen_string_literal: true

class PostSerializer < BaseSerializer
  attributes :title, :content, :released_at, :teaser_image_url, :pinned

  def released_at
    object.released_at.iso8601 if object.released_at.present?
  end

  def teaser_image_url
    object.teaser_image.url(public: true) if object.teaser_image.present?
  end
end
