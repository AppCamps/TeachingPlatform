# frozen_string_literal: true

class AddLastPostsReadAtToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :last_posts_read_at, :datetime
  end
end
