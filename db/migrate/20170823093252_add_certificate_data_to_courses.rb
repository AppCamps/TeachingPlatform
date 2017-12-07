# frozen_string_literal: true

class AddCertificateDataToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :certificate_data, :text
  end
end
