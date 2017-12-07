# frozen_string_literal: true

class CommonMistakeLesson < ApplicationRecord
  self.table_name = 'common_mistakes_lessons'

  belongs_to :common_mistake
  belongs_to :lesson, touch: true
end
