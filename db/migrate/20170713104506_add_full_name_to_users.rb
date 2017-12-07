# frozen_string_literal: true

class AddFullNameToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :full_name, :string
  end

  def data
    # set forum_name for each users
    User.reset_column_information
    User.all.each(&:save!)
  end
end
