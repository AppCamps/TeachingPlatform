# frozen_string_literal: true

module Api
  class ConfirmationsController < ApiController
    skip_before_action :authenticate, only: %i[create update]
    skip_before_action :require_accepted_privacy_policy, only: %i[create update]

    # Create confirmation email
    def create # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      # Get user which email is either the email or the unconfirmed email
      # Priority to user with confirmed email
      user_table = User.arel_table
      user = User.where(
        user_table[:email].eq(email_attribute)
          .or(user_table[:unconfirmed_email].eq(email_attribute))
      ).first

      head :accepted

      # If Email doesn't exist, end here
      return unless user

      # If email exists, is confirmed and not pending reconfirmation, end here
      return if user.confirmed? && !user.pending_reconfirmation?

      # If user is confirmed, but has pending reconfirmation
      if !user.confirmed?
        # Registration without confirmation
        I18n.with_locale(:de) { user.send_welcome_email }
      else
        # Change of email address: send email with confirmation instructions
        I18n.with_locale(:de) { user.send_confirmation_instructions }
      end
    end

    def update
      user = User.confirm_by_token(params[:confirmation_token])
      if user.errors.any?
        render json: user,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      else
        head :ok
      end
    end

    private

    def email_attribute
      params.require(:data).require(:attributes).permit(:email)[:email]
    end
  end
end
