# frozen_string_literal: true

class Topic < ApplicationRecord
  include TopicUploader[:icon]

  has_many :courses, dependent: :destroy

  has_many :published_courses,
           -> { published },
           class_name: Course.name,
           inverse_of: false

  has_many :preparation_materials, dependent: :destroy
  has_many :published_preparation_materials,
           -> { where(published: true) },
           class_name: PreparationMaterial.name,
           inverse_of: false

  validates :title, presence: true
  validates :slug, uniqueness: true
end
