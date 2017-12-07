# frozen_string_literal: true

module Api
  class LocalitiesController < ApiController
    def create # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      locality = Locality.new(locality_params.merge(user: current_user))
      Locality.transaction do
        # this should not happen here and is a quick-fix
        current_user.update(subjects: subjects_params)
        if locality.save
          render json: locality, include: [:user],
                 status: :created
        else
          render json: locality,
                 serializer: ActiveModel::Serializer::ErrorSerializer,
                 status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end
      end
    rescue ArgumentError => exception
      Rollbar.error(exception)
      render json: { errors: { detail: exception.message } }, status: :unprocessable_entity
    end

    private

    def subjects_params
      params.require(:data).require(:attributes).require(:subjects)
    end

    def locality_params
      params
        .require(:data).require(:attributes).except(:subjects)
        .permit(:school_type, :school_type_custom, :school_name,
                :country, :state, :postal_code, :city)
    end
  end
end
