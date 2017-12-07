# frozen_string_literal: true

class NullModel
  def read_attribute_for_serialization(*)
    nil
  end
end
