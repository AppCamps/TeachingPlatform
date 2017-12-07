# frozen_string_literal: true

class SessionSerializer < BaseSerializer
  belongs_to :user

  attributes :expire_after
end
