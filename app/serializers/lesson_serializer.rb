# frozen_string_literal: true

class LessonSerializer < BaseSerializer
  attributes :title, :description, :position

  belongs_to :course
  has_many :teaching_materials
  has_many :common_mistakes
  has_many :expertises

  def description
    simple_format(object.description)
  end
end
