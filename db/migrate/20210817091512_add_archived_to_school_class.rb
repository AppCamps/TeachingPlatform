class AddArchivedToSchoolClass < ActiveRecord::Migration[5.2]
  def change
    add_column :school_classes, :archived, :boolean, default: false
    add_index :school_classes, [:user_id, :archived]
  end
end
