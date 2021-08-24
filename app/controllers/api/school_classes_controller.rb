# frozen_string_literal: true

module Api
  class SchoolClassesController < ApiController # rubocop:disable Metrics/ClassLength
    include Api::Concerns::Filterable

    CourseRelationNotFoundError = Class.new(StandardError)
    rescue_from CourseRelationNotFoundError, with: :handle_course_relation_not_found

    def index
      # rename class filter to school_class
      class_filters = filters
      if class_filters[:classes].present?
        class_filters[:school_classes] = class_filters.delete(:classes)
      end

      school_classes = current_user.school_classes
                                   .not_archived
                                   .where(class_filters)
                                   .order('school_classes.created_at ASC')
                                   .eager_load(:course_school_classes)

      render json: school_classes,
             include: [:course_school_classes]
    end

    def create # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      JSONAPI.parse_resource!(params.permit!.to_h.except(:controller, :action).to_h)

      resource_type = attributes.require(:resource_type)
      properties = metrics_properties_for_resource_types(resource_type)
      metrics = MetricsConstructionService.new(attributes)
                                          .call(*properties)

      @school_class = current_user.school_classes.build(
        metrics: metrics
      )

      if relationships[:courses] && relationships[:courses][:data].try(:any?)
        school_class.courses =
          find_course_relationships(relationships[:courses][:data])
      end

      if school_class.save
        render json: school_class,
               include: %i[courses completed_lessons],
               status: :created
      else
        render json: school_class,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    def update # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/PerceivedComplexity
      JSONAPI.parse_resource!(params.permit!.to_h.except(:controller, :action, :id))
      
      resource_type = attributes.require(:resource_type)
      properties = metrics_properties_for_resource_types(resource_type)

      school_class.metrics = MetricsConstructionService.new(attributes).call(*properties)

      if relationships[:courses] && relationships[:courses][:data].try(:any?)
        Course.transaction do
          new_courses = find_course_relationships(relationships[:courses][:data])
          new_completed_lessons = school_class.completed_lessons.select do |lesson|
            new_courses.map(&:id).include?(lesson.course_id)
          end

          school_class.courses = new_courses
          school_class.completed_lessons = new_completed_lessons
        end
      elsif relationships[:courses] && relationships[:courses][:data].blank?
        Course.transaction do
          school_class.courses.destroy_all
          school_class.completed_lessons.destroy_all
        end
      end

      if school_class.save
        render json: school_class,
               include: %i[courses completed_lessons],
               dataMeta: {archived: school_class.archived},
               status: :ok               
      else
        render json: school_class,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    def archive
      params.permit!
      klass = current_user.school_classes.find(params[:class_id])
      p klass
      klass.archived = true

      if klass.save
        render json: klass,
               include: %i[courses completed_lessons],
               dataMeta: {archived: klass.archived},
               status: :ok               
      else
        render json: klass,
               status: :unprocessable_entity,
               serializer: ActiveModel::Serializer::ErrorSerializer
      end
    end

    def update_completed_lessons_relationship # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/LineLength
      JSONAPI.parse_relationship!(params.permit!.to_h.except(:controller, :action, :id))

      # rails params parser translates data: [] to data: nil
      if data.blank?
        school_class.completed_lessons.clear
      else
        ids_to_add = data.map { |lesson| Integer(lesson[:id]) }

        if school_class.courses.joins(:lessons).where(lessons: { id: ids_to_add }).empty?
          return render json: {
            errors: [{ details: 'Course not associated with class' }]
          },
                        status: :forbidden
        end

        new_completed_lesson_ids = school_class.completed_lesson_ids.concat(ids_to_add).uniq
        school_class.completed_lesson_ids = new_completed_lesson_ids
      end

      render json: school_class,
             status: :ok
    end

    def destroy_completed_lessons_relationship # rubocop:disable Metrics/AbcSize
      JSONAPI.parse_relationship!(params.permit!.to_h.except(:controller, :action, :id))

      # rails params parser translates data: [] to data: nil
      if data.present?
        ids_to_delete = data.map { |lesson| lesson[:id] }.map(&:to_i)

        if school_class.courses.joins(:lessons).where(lessons: { id: ids_to_delete }).empty?
          return render json: {
            errors: [{ details: 'Course not associated with class' }]
          },
                        status: :forbidden
        end

        new_completed_lesson_ids = school_class.completed_lesson_ids - ids_to_delete
        school_class.completed_lesson_ids = new_completed_lesson_ids
      end

      render json: school_class,
             status: :ok
    end

    private

    def handle_course_relation_not_found
      error = {
        source: { pointer: '/data/relationships/courses' },
        detail: 'course id not found'
      }
      render json: { errors: [error] }, status: :unauthorized
    end

    def find_course_relationships(course_relationships)
      courses_ids =
        course_relationships
        .select { |ref| ref['type'] == 'courses' }
        .map { |ref| ref['id'] }

      courses = Course
      unless current_user.admin?
        courses = courses
                  .joins(:published_lessons)
                  .where(lessons: { published: true })
                  .distinct
      end

      courses.find(courses_ids)
    rescue ActiveRecord::RecordNotFound => error
      Rollbar.error(error)
      raise CourseRelationNotFoundError
    end

    def metrics_properties_for_resource_types(resource_type)
      if resource_type == SchoolClass::SCHOOL_CLASS
        [SchoolClass::BASE_PROPERTIES, SchoolClass::SCHOOL_CLASS_PROPERTIES]
      else
        [SchoolClass::BASE_PROPERTIES, SchoolClass::EXTRACURRICULAR_PROPERTIES]
      end.flatten
    end

    def school_class
      @school_class ||= current_user.school_classes.find(params[:id])
    end

    def attributes
      data.require(:attributes)
    end

    def relationships
      data[:relationships] || {}
    end

    def data
      params[:data]
    end
  end
end
