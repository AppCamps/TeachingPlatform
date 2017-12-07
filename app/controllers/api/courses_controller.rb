# frozen_string_literal: true

module Api
  class CoursesController < ApiController
    def index # rubocop:disable Metrics/MethodLength
      courses = Course
                .eager_load(:topic)

      courses =
        if current_user.admin? || current_user.beta?
          courses
            .eager_load(
              lessons: %i[teaching_materials common_mistakes expertises]
            )
        else
          # serializer uses published_lessons for non-admins
          # probably use left outer join after rails 5 update
          courses
            .eager_load(
              published_lessons: %i[teaching_materials common_mistakes expertises]
            )
            .where(lessons: { published: true })
        end

      courses_json = cached(index_cache_key) do
        serialize_json(
          courses.all,
          serializer_options: {
            each_serializer: CourseSerializer
          },
          adapter_options: {
            include: [
              :topic,
              { lessons: %i[teaching_materials common_mistakes expertises] }
            ]
          }
        )
      end

      render json: courses_json, status: :ok
    end

    private

    def index_cache_key
      last_updated_topic = Topic.order(updated_at: :desc).first
      return if last_updated_topic.nil?

      cache_key = "/api/courses/#{last_updated_topic.updated_at.iso8601}"
      cache_key = "#{cache_key}-unpublished" if current_user.admin? || current_user.beta?
      cache_key
    end
  end
end
