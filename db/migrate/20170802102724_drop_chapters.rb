# frozen_string_literal: true

class DropChapters < ActiveRecord::Migration[4.2]
  def change
    drop_table :chapters
    drop_table :chapters_users
  end
end
