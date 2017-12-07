# frozen_string_literal: true

module Api
  class CourseSchoolClassesController < ApiController
    def update
      JSONAPI.parse_resource!(params.permit!.to_h.except(:controller, :action, :id))

      course_school_class.certificate_downloaded = attributes.require(:certificate_downloaded)

      if course_school_class.save
        render json: course_school_class,
               status: :ok
      else
        render json: course_school_class,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    private

    def course_school_class
      @course_school_class ||= CourseSchoolClass.find(params[:id])
    end

    def attributes
      data.require(:attributes)
    end

    def data
      params[:data]
    end
  end
end
