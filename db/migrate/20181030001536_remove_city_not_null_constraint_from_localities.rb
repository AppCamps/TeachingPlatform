# frozen_string_literal: true

class RemoveCityNotNullConstraintFromLocalities < ActiveRecord::Migration[4.2]
  def change
    change_column_null :localities, :city, true
  end
end
