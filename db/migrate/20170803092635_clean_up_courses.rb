# frozen_string_literal: true

class CleanUpCourses < ActiveRecord::Migration[4.2]
  def up
    execute(<<-SQL.squish)
      DELETE FROM courses WHERE on_teach_plattform = false;
    SQL

    remove_column :courses, :for_schools
    remove_column :courses, :content_div
    remove_column :courses, :on_teach_plattform
  end
end
