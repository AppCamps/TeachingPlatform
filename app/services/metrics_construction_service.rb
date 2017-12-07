# frozen_string_literal: true

class MetricsConstructionService
  def initialize(params)
    @params = params
  end

  def call(*metric_keys)
    metric_keys.each_with_object({}) do |key, memo|
      memo[key] = @params[key]
    end
  end
end
