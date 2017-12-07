# frozen_string_literal: true

class AddCertificateDownloadedToCoursesSchoolClasses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses_school_classes,
               :certificate_downloaded,
               :boolean,
               default: false,
               null: false
  end
end
