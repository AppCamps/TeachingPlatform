# frozen_string_literal: true

class DropEnrollments < ActiveRecord::Migration[4.2]
  def change
    drop_table :enrollments
  end
end
