# frozen_string_literal: true

class RemovePostalCodeNotNullConstraintFromLocalities < ActiveRecord::Migration[4.2]
  def change
    change_column_null :localities, :postal_code, true
  end
end
