# frozen_string_literal: true

class Lesson < ApplicationRecord
  belongs_to :course, touch: true

  has_many :teaching_materials, dependent: :destroy
  has_many :common_mistake_lessons, dependent: :destroy
  has_many :common_mistakes, through: :common_mistake_lessons

  has_many :expertise_lessons # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :expertises,
           through: :expertise_lessons,
           after_remove: :touch_persisted_record

  scope :published, -> { where(published: true) }

  validates :course, :title, :description, presence: true
  validates :title, :description, uniqueness: { scope: :course_id }

  private

  def touch_persisted_record(*)
    touch if persisted? # rubocop:disable Rails/SkipsModelValidations
  end
end
