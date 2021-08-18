# frozen_string_literal: true

class SchoolClassSerializer < BaseSerializer
  type :classes

  belongs_to :user
  has_many :completed_lessons
  has_many :course_school_classes

  attributes(
    *[
      SchoolClass::BASE_PROPERTIES,
      SchoolClass::SCHOOL_CLASS_PROPERTIES,
      SchoolClass::EXTRACURRICULAR_PROPERTIES
    ].flatten
  )

  meta do
    {
      archived: object.archived
    }
  end
end
