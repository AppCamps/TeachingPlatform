# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength

class InitDb < ActiveRecord::Migration[4.2]
  def up
    enable_extension 'plpgsql'
    enable_extension 'pg_stat_statements'
    enable_extension 'uuid-ossp'

    create_table 'chapters', force: :cascade do |t|
      t.integer  'lesson_id'
      t.string   'title', limit: 255
      t.text     'description'
      t.integer  'duration'
      t.string   'link_video', limit: 255
      t.text     'content'
      t.datetime 'created_at',                          null: false
      t.datetime 'updated_at',                          null: false
      t.integer  'position', default: 1
    end

    create_table 'chapters_users', force: :cascade do |t|
      t.integer  'chapter_id'
      t.integer  'user_id'
      t.datetime 'created_at'
      t.datetime 'updated_at'
    end

    add_index 'chapters_users', %w[user_id chapter_id], name: 'index_chapters_users_on_user_id_and_chapter_id', unique: true, using: :btree

    create_table 'common_mistakes', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.integer  'lesson_id', null: false
      t.integer  'position'
      t.string   'problem',    null: false
      t.text     'solution',   null: false
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
    end

    create_table 'completed_lessons_school_classes', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.integer  'lesson_id',       null: false
      t.uuid     'school_class_id', null: false
      t.datetime 'created_at',      null: false
      t.datetime 'updated_at',      null: false
    end

    add_index 'completed_lessons_school_classes', %w[lesson_id school_class_id], name: 'index_completed_lessons_school_classes_on_ids', unique: true, using: :btree
    add_index 'completed_lessons_school_classes', ['lesson_id'], name: 'index_completed_lessons_school_classes_on_lesson_id', using: :btree
    add_index 'completed_lessons_school_classes', ['school_class_id'], name: 'index_completed_lessons_school_classes_on_school_class_id', using: :btree

    create_table 'courses', force: :cascade do |t|
      t.string   'title',              limit: 255
      t.text     'description'
      t.datetime 'created_at',                                     null: false
      t.datetime 'updated_at',                                     null: false
      t.boolean  'for_schools', default: false, null: false
      t.text     'content_div'
      t.integer  'position', default: 1
      t.string   'slug', limit: 255, null: false
      t.uuid     'topic_id', null: false
      t.boolean  'on_teach_plattform', default: true
    end

    add_index 'courses', ['slug'], name: 'index_courses_on_slug', using: :btree

    create_table 'courses_school_classes', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.integer  'course_id',       null: false
      t.uuid     'school_class_id', null: false
      t.datetime 'created_at',      null: false
      t.datetime 'updated_at',      null: false
    end

    add_index 'courses_school_classes', ['course_id'], name: 'index_courses_school_classes_on_course_id', using: :btree
    add_index 'courses_school_classes', ['school_class_id'], name: 'index_courses_school_classes_on_school_class_id', using: :btree

    create_table 'courses_users', force: :cascade do |t|
      t.integer  'user_id'
      t.integer  'course_id'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
    end

    add_index 'courses_users', %w[user_id course_id], name: 'index_courses_users_on_user_id_and_course_id', unique: true, using: :btree

    create_table 'enrollments', force: :cascade do |t|
      t.integer  'user_id'
      t.text     'why_enroll'
      t.string   'planned_usage_custom'
      t.string   'school_name',           limit: 255
      t.string   'school_city',           limit: 255
      t.string   'school_state',          limit: 255
      t.text     'misc'
      t.datetime 'created_at',                        null: false
      t.datetime 'updated_at',                        null: false
      t.string   'referal', limit: 255, null: false
      t.string   'school_country', null: false
      t.string   'school_country_custom'
      t.string   'school_state_custom'
      t.string   'planned_usage', null: false
      t.string   'school_postal_code'
      t.string   'school_type', null: false
      t.string   'school_type_custom'
    end

    create_table 'expertises', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.string   'title'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
    end

    create_table 'expertises_lessons', force: :cascade do |t|
      t.integer 'lesson_id',    null: false
      t.uuid    'expertise_id', null: false
    end

    add_index 'expertises_lessons', %w[expertise_id lesson_id], name: 'index_expertises_lessons_on_expertise_id_and_lesson_id', using: :btree
    add_index 'expertises_lessons', %w[lesson_id expertise_id], name: 'index_expertises_lessons_on_lesson_id_and_expertise_id', using: :btree

    create_table 'lessons', force: :cascade do |t|
      t.integer  'course_id'
      t.string   'title', limit: 255
      t.text     'description'
      t.datetime 'created_at',                              null: false
      t.datetime 'updated_at',                              null: false
      t.integer  'position',                default: 1
      t.boolean  'published',               default: false, null: false
    end

    create_table 'localities', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.integer  'user_id', null: false
      t.integer  'school_type'
      t.string   'school_type_custom'
      t.string   'school_name'
      t.integer  'country', null: false
      t.string   'country_custom'
      t.string   'state'
      t.string   'state_custom'
      t.string   'city',               null: false
      t.string   'postal_code',        null: false
      t.datetime 'created_at',         null: false
      t.datetime 'updated_at',         null: false
    end

    add_index 'localities', ['user_id'], name: 'index_localities_on_user_id', using: :btree

    create_table 'preparation_materials', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.uuid     'topic_id',                    null: false
      t.string   'medium_type',                 null: false
      t.string   'icon',                        null: false
      t.string   'title',                       null: false
      t.string   'subtitle'
      t.text     'description'
      t.string   'link',                        null: false
      t.boolean  'published',   default: false, null: false
      t.integer  'position',    default: 0
      t.datetime 'created_at',                  null: false
      t.datetime 'updated_at',                  null: false
    end

    create_table 'school_classes', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.integer  'user_id'
      t.datetime 'created_at',              null: false
      t.datetime 'updated_at',              null: false
      t.jsonb    'metrics', default: {}, null: false
    end

    add_index 'school_classes', ['metrics'], name: 'index_school_classes_on_metrics', using: :gin

    create_table 'teaching_materials', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.integer  'lesson_id'
      t.string   'medium_type',    null: false
      t.string   'title',          null: false
      t.integer  'position'
      t.string   'subtitle'
      t.text     'image_data'
      t.string   'link', null: false
      t.boolean  'lesson_content'
      t.boolean  'listing_item'
      t.string   'listing_title'
      t.string   'listing_icon'
      t.datetime 'created_at',     null: false
      t.datetime 'updated_at',     null: false
    end

    create_table 'topics', id: :uuid, default: 'uuid_generate_v4()', force: :cascade do |t|
      t.string   'title',       null: false
      t.datetime 'created_at',  null: false
      t.datetime 'updated_at',  null: false
      t.string   'color'
      t.string   'light_color'
      t.text     'icon_data'
      t.string   'description'
    end

    create_table 'users', force: :cascade do |t|
      t.string   'email',                      limit: 255,                 null: false
      t.string   'encrypted_password',         limit: 255,                 null: false
      t.string   'reset_password_token',       limit: 255
      t.datetime 'reset_password_sent_at'
      t.datetime 'remember_created_at'
      t.integer  'sign_in_count', default: 0, null: false
      t.datetime 'current_sign_in_at'
      t.datetime 'last_sign_in_at'
      t.string   'current_sign_in_ip',         limit: 255
      t.string   'last_sign_in_ip',            limit: 255
      t.datetime 'created_at',                                             null: false
      t.datetime 'updated_at',                                             null: false
      t.string   'last_name',                                              null: false
      t.boolean  'admin', default: false, null: false
      t.string   'confirmation_token', limit: 255
      t.datetime 'confirmed_at'
      t.datetime 'confirmation_sent_at'
      t.string   'unconfirmed_email',          limit: 255
      t.string   'phone',                      limit: 255
      t.string   'subjects',                   limit: 255
      t.string   'first_name', null: false
      t.string   'gender'
      t.string   'gender_custom'
      t.date     'date_of_birth'
      t.string   'role', null: false
      t.string   'role_custom'
      t.integer  'teach_login_counter', default: 0, null: false
      t.datetime 'privacy_policy_accepted_at', null: false
      t.text     'referal'
      t.text     'comment'
      t.boolean  'beta', default: false
    end

    add_index 'users', ['confirmation_token'], name: 'index_users_on_confirmation_token', unique: true, using: :btree
    add_index 'users', ['email'], name: 'index_users_on_email', unique: true, using: :btree
    add_index 'users', ['reset_password_token'], name: 'index_users_on_reset_password_token', unique: true, using: :btree
  end

  def down
    raise ActiveRecord::IrreversibleMigration, 'The initial migration is not revertable'
  end
end
