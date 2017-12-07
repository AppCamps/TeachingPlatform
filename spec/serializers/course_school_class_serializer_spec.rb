# frozen_string_literal: true

require 'spec_helper'

describe CourseSchoolClassSerializer do
  let(:current_user) { create(:user) }
  let(:course_school_class) { create(:course_school_class) }

  let(:serializer_instance) do
    JsonApiSerializerService
      .new(course_school_class)
      .serializer(
        serializer_options: {
          scope: current_user,
          scope_name: :current_user
        }
      )
  end

  it 'belongs_to course' do
    course_relationship = serializer_instance.as_json.dig(:data, :relationships, :course)

    expect(course_relationship).to eql(
      data: {
        id: course_school_class.course_id.to_s,
        type: 'courses'
      }
    )
  end

  it 'belongs_to school_class' do
    school_class_relationship =
      serializer_instance.as_json.dig(:data, :relationships, :'school-class')

    expect(school_class_relationship).to eql(
      data: {
        id: course_school_class.school_class_id,
        type: 'school-classes'
      }
    )
  end

  %i[
    certificate_downloaded
  ].each do |attribute_name|
    it "serializes #{attribute_name}" do
      key = attribute_name.to_s.dasherize.to_sym
      expect(serializer_instance.as_json.dig(:data, :attributes, key))
        .to eql(course_school_class.send(attribute_name))
    end
  end

  describe '#certificate_url' do
    let(:course) { create(:course, :published, :with_certificate) }
    let(:school_class) do
      create(:school_class, :class, completed_lessons: course.published_lessons)
    end
    let(:course_school_class) do
      create(
        :course_school_class,
        course: course,
        school_class: school_class,
        certificate_downloaded: true
      )
    end

    describe 'course has no certificate' do
      it 'returns nil' do
        course.update(certificate: nil)

        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url')).to be(nil)
      end
    end

    describe 'object.certificate_downloaded is false' do
      it 'returns nil' do
        course_school_class.update(certificate_downloaded: false)

        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url')).to be(nil)
      end
    end

    context 'when admin' do
      let(:current_user) { create(:user, :admin) }
      let(:course) { create(:course, :unpublished, :with_certificate) }

      it 'returns nil if not all lessons are completed' do
        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url')).to be(nil)
      end

      it 'returns certificate url if all lessons are completed' do
        course.lessons << create(:lesson, :unpublished)
        school_class.completed_lessons = course.lessons

        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url'))
          .to match(%r{/uploads/})
      end
    end

    context 'when beta user' do
      let(:current_user) { create(:user, :beta) }
      let(:course) { create(:course, :unpublished, :with_certificate) }

      it 'returns nil if not all lessons are completed' do
        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url')).to be(nil)
      end

      it 'returns certificate url all lessons are completed' do
        course.lessons << create(:lesson, :unpublished)
        school_class.completed_lessons = course.lessons

        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url'))
          .to match(%r{/uploads/})
      end
    end

    describe 'normal user' do
      it 'returns certificate_url if all published_lessons are completed' do
        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url'))
          .to match(%r{/uploads/})
      end

      it 'returns nil not all published_lessons are completed' do
        school_class # define school_class before adding another published lesson
        course.published_lessons << create(:lesson, published: true)

        expect(serializer_instance.as_json.dig(:data, :attributes, :'certificate-url'))
          .to be(nil)
      end
    end
  end
end
