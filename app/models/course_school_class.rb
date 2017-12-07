# frozen_string_literal: true

class CourseSchoolClass < ApplicationRecord
  def self.table_name
    'courses_school_classes'
  end

  belongs_to :course
  belongs_to :school_class
end
