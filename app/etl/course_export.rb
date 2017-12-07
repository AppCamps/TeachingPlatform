# frozen_string_literal: true

class CourseExport < ETL::Export
  klass 'Course'

  drop_destination_table_sql do
    'DROP TABLE IF EXISTS courses;'
  end

  destination_table_sql do
    <<-SQL.squish
      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY NOT NULL,
        title VARCHAR(255)
      );
    SQL
  end

  insert_sql do |data|
    <<-SQL.squish
      INSERT INTO courses
        (id, title)
      VALUES
        (
          #{data[:id]},
          '#{data[:title]}'
        )
      ON DUPLICATE KEY UPDATE
        title = VALUES(title);
    SQL
  end

  columns :id, :title

  def title
    "#{source.topic.title} | #{source.title}"
  end
end
