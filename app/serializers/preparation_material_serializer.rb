# frozen_string_literal: true

class PreparationMaterialSerializer < BaseSerializer
  belongs_to :topic

  attributes :medium_type, :title, :subtitle, :link,
             :description, :icon, :position
end
