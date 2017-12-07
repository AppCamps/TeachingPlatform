# frozen_string_literal: true

class AddUniqueIndexForTitleAndSlugOnCourses < ActiveRecord::Migration[5.0]
  def change
    add_index :courses, %i[title topic_id], unique: true
    add_index :courses, %i[slug topic_id], unique: true
  end
end
