# frozen_string_literal: true

class TeachingMaterial < ApplicationRecord
  include TeachingMaterialUploader[:image]

  belongs_to :lesson, touch: true

  enum medium_type: {
    medium_type_video: 0,
    medium_type_other: 1
  }

  validates :medium_type, :title, :link, presence: true
  validates :medium_type, :title, :subtitle, :link,
            :listing_title, :listing_icon, length: { maximum: 255 }
end
