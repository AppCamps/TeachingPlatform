# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[5.1]
  def change
    create_table :posts, id: :uuid do |t|
      t.string :title
      t.text :teaser_image_data
      t.text :content
      t.datetime :released_at
      t.timestamps null: false
    end
  end
end
