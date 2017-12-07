# frozen_string_literal: true

class LocalitySerializer < BaseSerializer
  belongs_to :user

  attributes :school_type, :school_type_custom, :school_name,
             :country, :state, :city, :postal_code, :subjects

  def subjects
    object.user.subjects
  end
end
