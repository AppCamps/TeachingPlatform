# frozen_string_literal: true

class MoveRenameCustomAndStateCustomToCountryAndStateInLocalities < ActiveRecord::Migration[4.2]
  def change
    remove_column :localities, :country
    rename_column :localities, :country_custom, :country

    remove_column :localities, :state
    rename_column :localities, :state_custom, :state
  end
end
