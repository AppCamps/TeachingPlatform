# frozen_string_literal: true

class CleanUpUsers < ActiveRecord::Migration[4.2]
  def change
    remove_column :users, :sign_in_count
    remove_column :users, :phone
    remove_column :users, :gender
    remove_column :users, :gender_custom
    remove_column :users, :date_of_birth
    remove_column :users, :comment

    rename_column :users, :teach_login_counter, :sign_in_count
  end
end
