# frozen_string_literal: true

class RemoveLessonIdFromCommonMistake < ActiveRecord::Migration[5.1]
  def change
    remove_column :common_mistakes, :lesson_id
  end
end
