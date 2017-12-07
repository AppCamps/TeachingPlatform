# frozen_string_literal: true

class CommonMistakeSerializer < BaseSerializer
  has_many :lessons

  attributes :position, :problem, :solution

  def solution
    simple_format(object.solution)
  end
end
