# frozen_string_literal: true

# this is a virtual model for api authentication only
class Session < ActiveModelSerializers::Model
  attributes :user, :expire_after

  def id
    @id ||= SecureRandom.uuid
  end
end
