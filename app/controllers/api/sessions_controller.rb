# frozen_string_literal: true

module Api
  class SessionsController < ApiController
    skip_before_action :authenticate, only: [:create]
    skip_before_action :require_accepted_privacy_policy, only: %i[create show]

    def create # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      email = attributes.require(:email)
      password = attributes.require(:password)

      user = User.find_by(email: email)
      errors_hash = nil
      if !user || !user.valid_password?(password)
        errors_hash = {
          errors: [
            { code: 'invalid_email_or_password', title: 'Invalid email or password' }
          ]
        }
      elsif !user.confirmed?
        errors_hash = {
          errors: [
            { code: 'email_unconfirmed', title: 'Email ist not confirmed' }
          ]
        }
      end

      if errors_hash.present?
        render json: errors_hash, status: :unauthorized
      else
        session = Session.new(
          user: user,
          expire_after: Devise.remember_for.to_i
        )

        user.remember_me = true
        sign_in(user, store: true)

        render json: session, status: :created,
               include: { user: :locality }, serializer: SessionSerializer
      end
    end

    def show
      remember_expires_at = current_user.remember_created_at + Devise.remember_for
      seconds_to_expiration = (remember_expires_at - Time.zone.now).to_i

      session = Session.new(
        user: current_user,
        expire_after: seconds_to_expiration
      )

      render json: session, status: :ok,
             include: { user: :locality }, serializer: SessionSerializer
    end

    def destroy
      sign_out
      render json: {}, status: :ok
    end

    private

    def attributes
      @attributes ||= params.require(:data).require(:attributes)
    end
  end
end
