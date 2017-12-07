# frozen_string_literal: true

class UserExport < ETL::Export
  klass 'User'

  scope do
    User.includes(:current_locality)
  end

  drop_destination_table_sql do
    'DROP TABLE IF EXISTS users;'
  end

  destination_table_sql do
    <<-SQL.squish
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY NOT NULL,
        created_at DATETIME NOT NULL,
        confirmed_at DATETIME,
        role VARCHAR(255) NOT NULL,
        sign_in_count INT,
        country VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        school_type VARCHAR(255) NOT NULL,
        school_classes_count INT,
        school_classes_with_completed_lessons_count INT,
        referral TEXT
      );
    SQL
  end

  insert_sql do |data|
    <<-SQL.squish
      INSERT INTO users
        (
          id, created_at, confirmed_at, role, sign_in_count, country,
          state, school_type, school_classes_count, school_classes_with_completed_lessons_count,
          referral
        )
      VALUES
        (
          #{data[:id]},
          '#{data[:created_at]}',
          #{value_or_null(data[:confirmed_at])},
          #{value_or_not_present(data[:role])},
          #{value_or_null(data[:sign_in_count])},
          #{value_or_not_present(data[:country])},
          #{value_or_not_present(data[:state])},
          #{value_or_not_present(data[:school_type])},
          #{value_or_null(data[:school_classes_count])},
          #{value_or_null(data[:school_classes_with_completed_lessons_count])},
          #{value_or_not_present(data[:referral])}
        )
      ON DUPLICATE KEY UPDATE
        created_at = VALUES(created_at),
        confirmed_at = VALUES(confirmed_at),
        role = VALUES(role),
        sign_in_count = VALUES(sign_in_count),
        country = VALUES(country),
        state = VALUES(state),
        school_type = VALUES(school_type),
        school_classes_count = VALUES(school_classes_count),
        school_classes_with_completed_lessons_count = VALUES(school_classes_with_completed_lessons_count),
        referral = VALUES(referral);
    SQL
  end

  columns :id, :created_at, :confirmed_at, :role, :sign_in_count,
          :country, :state, :school_type, :school_classes_count,
          :school_classes_with_completed_lessons_count, :referral

  delegate :school_type, to: 'source.current_locality', allow_nil: true

  def created_at
    source.created_at.to_s(:db)
  end

  def confirmed_at
    source.confirmed_at.try(:to_s, :db)
  end

  def country
    return if source.current_locality.nil?
    source.current_locality.country_service.name
  end

  def state
    return if source.current_locality.nil?
    state = source.current_locality.country_service.states[source.current_locality.state]
    "#{state} | #{country}"
  end

  def school_classes_count
    count = source.school_classes.count
    count if count.positive?
  end

  def sign_in_count
    source.sign_in_count if source.sign_in_count.positive?
  end

  def school_classes_with_completed_lessons_count
    count = source.school_classes
                  .map { |school_class| school_class.completed_lessons.count }
                  .reject(&:zero?)
                  .count
    return count if count.positive?
  end

  def referral
    source.referal
  end
end
