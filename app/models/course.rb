# frozen_string_literal: true

class Course < ApplicationRecord
  include CourseUploader[:certificate]

  validates :title, :slug,
            presence: true,
            uniqueness: { scope: :topic_id, case_sensitive: false }
  validates :title, :slug, length: { maximum: 255 }
  validates :topic, presence: true

  default_scope { Course.order(:position) }

  belongs_to :topic,
             -> { merge(Topic.order(:title)) },
             touch: true

  has_many :course_school_classes, dependent: :destroy
  has_many :school_classes, through: :course_school_classes

  has_many :lessons, dependent: :destroy
  has_many :published_lessons,
           -> { where(published: true) },
           class_name: Lesson.to_s

  scope :published,
        (lambda do
          where(
            'courses.id IN (SELECT DISTINCT(course_id) FROM lessons WHERE lessons.published = ?)',
            true
          )
        end)
end
