# frozen_string_literal: true

class SchoolClassExport < ETL::Export
  klass 'SchoolClass'

  scope do
    SchoolClass.includes(:completed_lessons)
  end

  drop_destination_table_sql do
    'DROP TABLE IF EXISTS school_classes;'
  end

  destination_table_sql do
    <<-SQL.squish
      CREATE TABLE IF NOT EXISTS school_classes (
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        created_at DATETIME,
        girl_count INT,
        boy_count INT,
        grade VARCHAR(255),
        planned_school_usage VARCHAR(255),
        completed_lessons_count INT,
        user_id INT NOT NULL,
        course_titles TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    SQL
  end

  insert_sql do |data|
    <<-SQL.squish
      INSERT INTO school_classes
        (id, created_at, girl_count, boy_count, grade, planned_school_usage, completed_lessons_count, user_id, course_titles)
      VALUES
        (
          '#{data[:id]}',
          '#{data[:created_at]}',
          #{value_or_null(data[:girl_count])},
          #{value_or_null(data[:boy_count])},
          #{value_or_not_present(data[:grade])},
          #{value_or_not_present(data[:planned_school_usage])},
          #{value_or_null(data[:completed_lessons_count])},
          #{data[:user_id]},
          #{value_or_not_present(data[:course_titles])}
        )
      ON DUPLICATE KEY UPDATE
        created_at = VALUES(created_at),
        girl_count = VALUES(girl_count),
        boy_count = VALUES(boy_count),
        grade = VALUES(grade),
        planned_school_usage = VALUES(planned_school_usage),
        completed_lessons_count = VALUES(completed_lessons_count),
        course_titles = VALUES(course_titles),
        user_id = VALUES(user_id);
    SQL
  end

  columns :id, :created_at, :girl_count, :boy_count, :grade, :user_id,
          :planned_school_usage, :completed_lessons_count, :course_titles

  def created_at
    source.created_at.to_s(:db)
  end

  def completed_lessons_count
    source.completed_lessons.count if source.completed_lessons.any?
  end

  def user_id
    skip_record! if source.user.nil?
    source.user_id
  end

  def course_titles
    source.courses.pluck(:title).sort.join(', ')
  end
end
