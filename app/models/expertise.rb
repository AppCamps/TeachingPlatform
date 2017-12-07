# frozen_string_literal: true

class Expertise < ApplicationRecord
  has_many :expertise_lessons, dependent: :destroy
  has_many :lessons, through: :expertise_lessons

  validates :title, presence: true, length: { maximum: 255 }
end
