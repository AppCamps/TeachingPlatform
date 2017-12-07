# frozen_string_literal: true

RSpec::Matchers.define :an_instance_with_id do |klass, id|
  match { |actual| actual.is_a?(klass) && actual.id == id }
end
