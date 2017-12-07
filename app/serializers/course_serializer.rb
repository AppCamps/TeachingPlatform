# frozen_string_literal: true

class CourseSerializer < BaseSerializer
  belongs_to :topic
  has_many :lessons

  attributes :title, :description, :slug, :position, :certificate

  def lessons
    if current_user.admin? || current_user.beta?
      object.lessons
    else
      object.published_lessons
    end
  end

  def certificate
    object.certificate.present?
  end
end
