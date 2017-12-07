# frozen_string_literal: true

class AddPinnedToPosts < ActiveRecord::Migration[5.1]
  def change
    add_column :posts, :pinned, :boolean, null: false, default: false
  end
end
