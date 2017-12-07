# frozen_string_literal: true

class TeachingMaterialSerializer < BaseSerializer
  belongs_to :lesson

  attributes :medium_type, :title, :subtitle, :image, :link,
             :lesson_content, :listing_item, :listing_title,
             :listing_icon, :position

  def image
    object.image.try(:url, public: true)
  end
end
