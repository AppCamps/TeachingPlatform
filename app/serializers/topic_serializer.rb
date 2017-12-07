# frozen_string_literal: true

class TopicSerializer < BaseSerializer
  attributes :title, :description, :color, :light_color, :icon, :slug

  has_many :courses
  has_many :preparation_materials

  def courses
    return object.courses if current_user.admin?
    object.published_courses
  end

  def preparation_materials
    return object.preparation_materials if current_user.admin?
    object.published_preparation_materials
  end

  def color
    "##{object.color}" if object.color
  end

  def light_color
    "##{object.light_color}" if object.light_color
  end

  def icon
    object.icon.url(public: true) if object.icon.present?
  end
end
