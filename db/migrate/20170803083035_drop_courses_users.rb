# frozen_string_literal: true

class DropCoursesUsers < ActiveRecord::Migration[4.2]
  def change
    drop_table :courses_users
  end
end
