# frozen_string_literal: true

class PreparationMaterial < ApplicationRecord
  belongs_to :topic, touch: true

  enum medium_type: {
    medium_type_video: 0,
    medium_type_document: 1,
    medium_type_link: 2,
    medium_type_other: 3
  }

  validates :medium_type, :title, :link, :icon,
            presence: true
  validates :medium_type, :title, :subtitle, :link, :icon,
            length: { maximum: 255 }
end
