# frozen_string_literal: true

# default serializer for user
class UserSerializer < BaseSerializer
  has_one :locality

  attributes :email, :unconfirmed_email, :first_name, :last_name,
             :created_at, :intercom_hash, :privacy_policy_accepted,
             :teacher, :school_classes_count, :unread_posts_present

  def school_classes_count
    object.school_classes.count
  end

  def created_at
    object.created_at.to_i
  end

  def locality
    object.current_locality
  end

  def teacher
    object.role_teacher?
  end

  def unread_posts_present
    object.unread_posts_present?
  end
end
