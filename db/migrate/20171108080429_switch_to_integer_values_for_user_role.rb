# frozen_string_literal: true

class SwitchToIntegerValuesForUserRole < ActiveRecord::Migration[5.1]
  def up
    User.find_in_batches do |batch|
      batch.each do |user|
        new_role = user.attributes_before_type_cast['role']
        user.role = new_role
        user.save(validate: false)
      end
    end

    execute <<-SQL
      ALTER TABLE "users" ALTER COLUMN "role" TYPE integer USING role::integer
    SQL
  end
end
