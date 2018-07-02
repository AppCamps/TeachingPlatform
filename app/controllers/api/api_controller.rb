# frozen_string_literal: true

module Api
  class ApiController < ::ApplicationController
    AuthenticationError = Class.new(StandardError)
    AuthenticationMissingError = Class.new(AuthenticationError)
    AuthenticationPrivacyPolicyMissingError = Class.new(AuthenticationError)

    around_action :with_english_locale

    before_action :require_json_api_mime_type
    before_action :authenticate
    before_action :require_accepted_privacy_policy
    before_action :deep_underscore_param_keys

    after_action :set_content_type

    skip_before_action :authenticate, only: :handle_not_found
    skip_before_action :require_accepted_privacy_policy, only: :handle_not_found

    rescue_from AuthenticationError,
                with: :handle_authentication_error
    rescue_from AuthenticationMissingError,
                with: :handle_authentication_missing_error
    rescue_from ActionController::ParameterMissing,
                with: :handle_action_controller_parameter_missing
    rescue_from ActiveRecord::RecordNotFound,
                with: :handle_not_found

    def handle_not_found
      head :not_found
    end

    protected

    def cached(key)
      return yield unless key

      Rails.cache.fetch(key) do
        yield
      end
    end

    def serialize_json(resource, serializer_options: {}, adapter_options: {})
      ::JsonApiSerializerService.new(resource).as_json(
        serializer_options: {
          scope: current_user,
          scope_name: :current_user
        }.merge(serializer_options),
        adapter_options: adapter_options
      )
    end

    private

    def with_english_locale
      I18n.with_locale(:en) do
        yield
      end
    end

    def transform_key(key)
      key.to_s.underscore
    end

    def deep_underscore_param_keys
      # TODO: try to come up with something better...
      params.send(:parameters).send(:try, :deep_transform_keys!, &:underscore)
    end

    def require_json_api_mime_type
      head(:not_acceptable) unless request.content_type == Mime[:jsonapi].to_s
    end

    def handle_action_controller_parameter_missing(exception)
      Rollbar.error(exception)

      klass = Class.new
      klass.include ActiveModel::Validations

      resource = klass.new
      resource.errors.add(exception.param, exception.message)

      render json: resource, status: :bad_request,
             serializer: ActiveModel::Serializer::ErrorSerializer
    end

    def handle_authentication_error(error)
      message = error.message if error
      error = { code: 'authentication_error', title: message }
      render json: { errors: [error] }, status: :unauthorized
    end

    def handle_authentication_missing_error(_error)
      error = { code: 'authentication_error' }
      render json: { errors: [error] }, status: :unauthorized
    end

    def authenticate
      warden.authenticate(scope: :user)
      raise AuthenticationMissingError, nil if current_user.blank?
    end

    def require_accepted_privacy_policy
      return if !current_user || current_user.privacy_policy_accepted
      raise AuthenticationPrivacyPolicyMissingError, 'Privacy Policy not accepted'
    end

    def set_content_type
      self.content_type = Mime[:jsonapi].to_s
    end
  end
end
