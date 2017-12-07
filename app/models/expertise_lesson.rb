# frozen_string_literal: true

class ExpertiseLesson < ApplicationRecord
  self.table_name = 'expertises_lessons'

  belongs_to :expertise
  belongs_to :lesson, touch: true
end
