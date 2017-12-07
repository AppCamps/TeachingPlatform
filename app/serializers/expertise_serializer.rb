# frozen_string_literal: true

class ExpertiseSerializer < BaseSerializer
  has_many :lessons

  attributes :title
end
