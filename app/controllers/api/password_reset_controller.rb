# frozen_string_literal: true

module Api
  class PasswordResetController < ApiController
    skip_before_action :authenticate, only: %i[create update]
    skip_before_action :require_accepted_privacy_policy, only: %i[create update]

    def create
      user = User.find_by(email_attributes)
      user.try(:send_reset_password_instructions)

      head :accepted
    end

    def update
      attributes = reset_password_attributes
                   .merge(reset_password_token: params[:reset_password_token])
      user = User.reset_password_by_token(attributes)

      # don't user user.invalid? since it triggers a validation for an empty user
      if user.errors.any?
        render json: user,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      else
        head :no_content
      end
    end

    private

    def reset_password_attributes
      params
        .require(:data).require(:attributes)
        .permit(:password, :password_confirmation)
    end

    def email_attributes
      params.require(:data).require(:attributes).permit(:email)
    end
  end
end
