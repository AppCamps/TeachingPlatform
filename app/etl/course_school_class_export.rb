# frozen_string_literal: true

class CourseSchoolClassExport < ETL::Export
  klass 'CourseSchoolClass'

  drop_destination_table_sql do
    'DROP TABLE IF EXISTS courses_school_classes;'
  end

  destination_table_sql do
    <<-SQL.squish
      CREATE TABLE IF NOT EXISTS courses_school_classes (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        course_id INT NOT NULL,
        school_class_id VARCHAR(36) NOT NULL,
        created_at DATETIME NOT NULL,
        course_title VARCHAR(255) NOT NULL,
        boy_count INT,
        girl_count INT,
        certificate_downloaded BOOLEAN NOT NULL DEFAULT false
      );
    SQL
  end

  insert_sql do |data|
    <<-SQL.squish
      INSERT INTO courses_school_classes
        (id, course_id, school_class_id, created_at, course_title, boy_count, girl_count, certificate_downloaded)
      VALUES
        (
          '#{data[:id]}',
          #{data[:course_id]},
          '#{data[:school_class_id]}',
          '#{data[:created_at]}',
          '#{data[:course_title]}',
          #{value_or_null(data[:boy_count])},
          #{value_or_null(data[:girl_count])},
          #{data[:certificate_downloaded]}
        )
      ON DUPLICATE KEY UPDATE
        course_id = VALUES(course_id),
        school_class_id = VALUES(school_class_id),
        created_at = VALUES(created_at),
        course_title = VALUES(course_title),
        boy_count = VALUES(boy_count),
        girl_count = VALUES(girl_count),
        certificate_downloaded = VALUES(certificate_downloaded);
    SQL
  end

  columns :id, :course_id, :school_class_id, :created_at,
          :course_title, :girl_count, :boy_count, :certificate_downloaded

  def created_at
    source.created_at.to_s(:db)
  end

  def course_title
    source.course.title
  end

  def boy_count
    source.school_class.boy_count
  end

  def girl_count
    source.school_class.girl_count
  end
end
