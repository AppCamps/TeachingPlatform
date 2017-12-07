# frozen_string_literal: true

module Api
  class UsersController < ApiController
    skip_before_action :authenticate, only: [:create]
    skip_before_action :require_accepted_privacy_policy, only: %i[create update]

    def create # rubocop:disable Metrics/MethodLength
      user = User.new(create_attributes)

      user.validate_privacy_policy_accepted = true
      user.validate_referal_on_api_signup = true
      user.validate_password_confirmation = true
      user.skip_confirmation_notification!

      if user.save
        I18n.with_locale(:de) { user.send_welcome_email }

        render json: user,
               status: :created
      else
        render json: user,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    def update # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/PerceivedComplexity
      current_user.validate_privacy_policy_accepted = true

      attributes = update_attributes
      if current_user.email == update_attributes[:email]
        attributes[:unconfirmed_email] = nil
        attributes[:confirmation_token] = nil
      end

      success = if password_change?
                  current_user.update_with_password(attributes)
                else
                  current_user.update(attributes)
                end

      bypass_sign_in(current_user) if success && password_change?

      if success
        render json: current_user,
               status: :ok
      else
        render json: current_user,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    private

    def create_attributes
      params
        .require(:data).require(:attributes)
        .permit(:role, :email, :password, :password_confirmation,
                :first_name, :last_name, :referal, :comment,
                :privacy_policy_accepted)
    end

    def update_attributes
      params
        .require(:data).require(:attributes)
        .permit(
          :email, :first_name, :last_name, :privacy_policy_accepted,
          :current_password, :password, :password_confirmation, :unread_posts_present
        ).to_h
    end

    def password_change?
      update_attributes.any? do |(key)|
        %i[current_password password password_confirmation].include?(key.to_sym)
      end
    end
  end
end
