# frozen_string_literal: true

module Api
  module Concerns
    module Filterable
      def filters
        @filters = {}
        params[:filter]&.each do |key, value|
          levels = key.to_s.split('.').push(value)
          filter_hash = levels.reverse.inject { |a, e| { e.to_sym => a } }
          @filters.deep_merge!(filter_hash)
        end
        @filters
      end
    end
  end
end
