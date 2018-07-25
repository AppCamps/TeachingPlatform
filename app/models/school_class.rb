# frozen_string_literal: true

class SchoolClass < ApplicationRecord
  SCHOOL_CLASS = 'school_class'
  EXTRACURRICULAR = 'extracurricular'

  RESOURCE_TYPES = [SCHOOL_CLASS, EXTRACURRICULAR].freeze
  PLANNED_SCHOOL_USAGE = %w[
    lesson_duty
    lesson_choice
    project_group
    project_days
  ].freeze

  BASE_PROPERTIES = %i[
    resource_type
    girl_count
    boy_count
  ].freeze

  SCHOOL_CLASS_PROPERTIES = %i[
    class_name
    school_year
    grade
    planned_school_usage
    school_subject
  ].freeze

  EXTRACURRICULAR_PROPERTIES = %i[
    group_name
    year
    age
    planned_extracurricular_usage
  ].freeze

  store :metrics,
        coder: JSON,
        accessors: [
          BASE_PROPERTIES,
          SCHOOL_CLASS_PROPERTIES,
          EXTRACURRICULAR_PROPERTIES
        ].flatten

  belongs_to :user
  has_one :locality,
          (lambda do |school_class|
            where(<<-SQL, school_class.user_id).order(created_at: :desc)
              #{Locality.arel_table[:created_at].lt(school_class.created_at).to_sql}
              OR "localities"."id" IN (
                SELECT id
                FROM localities as local
                WHERE "local"."user_id" = '?'
                ORDER BY "local"."created_at" ASC
                LIMIT 1
              )
            SQL
          end),
          class_name: Locality.name,
          foreign_key: :user_id,
          primary_key: :user_id,
          inverse_of: false

  has_many :course_school_classes, dependent: :destroy
  has_many :courses, through: :course_school_classes

  # rubocop:disable Rails/HasAndBelongsToMany
  has_and_belongs_to_many :completed_lessons,
                          class_name: Lesson.name,
                          join_table: :completed_lessons_school_classes
  # rubocop:enable Rails/HasAndBelongsToMany

  validates :resource_type, inclusion: { in: RESOURCE_TYPES }
  validates :class_name, :school_year, presence: true, if: -> { school_class? }
  validates :planned_school_usage,
            inclusion: { in: PLANNED_SCHOOL_USAGE },
            allow_blank: true,
            if: -> { school_class? }
  validates :group_name, :year, presence: true, unless: -> { school_class? }
  validates :girl_count, :boy_count,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 999,
              allow_blank: true
            }

  def name
    class_name || group_name
  end

  def boy_count=(value)
    return if value.blank? ? super(nil) : super
  end

  def girl_count=(value)
    return if value.blank? ? super(nil) : super
  end

  def planned_school_usage=(value)
    return if value.blank? ? super(nil) : super
  end

  private

  def school_class?
    resource_type == SCHOOL_CLASS
  end
end
