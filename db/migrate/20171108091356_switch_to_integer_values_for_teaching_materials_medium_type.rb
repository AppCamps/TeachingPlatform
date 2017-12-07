# frozen_string_literal: true

class SwitchToIntegerValuesForTeachingMaterialsMediumType < ActiveRecord::Migration[5.1]
  def up
    TeachingMaterial.find_in_batches do |batch|
      batch.each do |teaching_material|
        new_medium_type = teaching_material.attributes_before_type_cast['medium_type']
        teaching_material.medium_type = new_medium_type
        teaching_material.save(validate: false)
      end
    end

    execute <<-SQL
      ALTER TABLE "teaching_materials" ALTER COLUMN "medium_type" TYPE integer USING medium_type::integer
    SQL
  end
end
