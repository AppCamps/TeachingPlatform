# frozen_string_literal: true

class CommonMistake < ApplicationRecord
  has_many :common_mistake_lessons, dependent: :destroy
  has_many :lessons, through: :common_mistake_lessons

  validates :problem, :solution, presence: true
  validates :problem, length: { maximum: 255 }
end
