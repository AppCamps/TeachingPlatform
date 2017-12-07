# frozen_string_literal: true

class SwitchToIntegerValuesForPreparationMaterialsMediumType < ActiveRecord::Migration[5.1]
  def up
    PreparationMaterial.find_in_batches do |batch|
      batch.each do |preparation_material|
        new_medium_type = preparation_material.attributes_before_type_cast['medium_type']
        preparation_material.medium_type = new_medium_type
        preparation_material.save(validate: false)
      end
    end

    execute <<-SQL
      ALTER TABLE "preparation_materials" ALTER COLUMN "medium_type" TYPE integer USING medium_type::integer
    SQL
  end
end
