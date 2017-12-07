# frozen_string_literal: true

class ConvertHashToJsonForMetricsInSchoolClasses < ActiveRecord::Migration[5.0]
  TemporaryModel = Class.new(ApplicationRecord) { self.table_name = 'school_classes' }

  def up
    TemporaryModel.all.each do |school_class|
      metrics = school_class.metrics
      school_class.update!(metrics: metrics.to_json) if metrics.is_a?(Hash)
    end
  end

  def down
    TemporaryModel.all.each do |school_class|
      metrics = school_class.metrics
      if metrics.is_a?(String)
        school_class.update!(metrics: JSON.parse(metrics))
      end
    end
  end
end
