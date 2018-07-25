# frozen_string_literal: true

class CourseSchoolClassSerializer < BaseSerializer
  belongs_to :course
  belongs_to :school_class

  attributes :certificate_downloaded, :certificate_url

  def certificate_url # rubocop:disable Metrics/AbcSize
    return if object.course.certificate.blank?
    return unless object.certificate_downloaded

    course = object.course
    school_class = object.school_class

    return unless all_lessons_completed?(course, school_class)

    filename = "zertifikat-#{school_class.name.parameterize}-#{course.title.parameterize}"
    extension = course.certificate.metadata['filename'].split('.')[-1]
    object.course.certificate.url(
      download: true,
      expires_in: 24.hours.to_i,
      response_content_disposition: "attachment;filename=#{filename}.#{extension}"
    )
  end

  private

  def all_lessons_completed?(course, school_class)
    lesson_ids = if current_user.admin? || current_user.beta?
                   course.lesson_ids
                 else
                   course.published_lesson_ids
                 end

    (lesson_ids & school_class.completed_lesson_ids) == lesson_ids
  end
end
