# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_08_17_091512) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "blazer_audits", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "query_id"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at"
    t.index ["query_id"], name: "index_blazer_audits_on_query_id"
    t.index ["user_id"], name: "index_blazer_audits_on_user_id"
  end

  create_table "blazer_checks", force: :cascade do |t|
    t.bigint "creator_id"
    t.bigint "query_id"
    t.string "state"
    t.string "schedule"
    t.text "emails"
    t.text "slack_channels"
    t.string "check_type"
    t.text "message"
    t.datetime "last_run_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_checks_on_creator_id"
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_blazer_dashboard_queries_on_dashboard_id"
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade do |t|
    t.bigint "creator_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_dashboards_on_creator_id"
  end

  create_table "blazer_queries", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_queries_on_creator_id"
  end

  create_table "common_mistakes", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "position"
    t.string "problem", null: false
    t.text "solution", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "common_mistakes_lessons", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "common_mistake_id"
    t.bigint "lesson_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["common_mistake_id"], name: "index_common_mistakes_lessons_on_common_mistake_id"
    t.index ["lesson_id"], name: "index_common_mistakes_lessons_on_lesson_id"
  end

  create_table "completed_lessons_school_classes", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "lesson_id", null: false
    t.uuid "school_class_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id", "school_class_id"], name: "index_completed_lessons_school_classes_on_ids", unique: true
    t.index ["lesson_id"], name: "index_completed_lessons_school_classes_on_lesson_id"
    t.index ["school_class_id"], name: "index_completed_lessons_school_classes_on_school_class_id"
  end

  create_table "courses", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position", default: 1
    t.string "slug", limit: 255, null: false
    t.uuid "topic_id", null: false
    t.text "certificate_data"
    t.index ["slug", "topic_id"], name: "index_courses_on_slug_and_topic_id", unique: true
    t.index ["slug"], name: "index_courses_on_slug"
    t.index ["title", "topic_id"], name: "index_courses_on_title_and_topic_id", unique: true
  end

  create_table "courses_school_classes", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "course_id", null: false
    t.uuid "school_class_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "certificate_downloaded", default: false, null: false
    t.index ["course_id"], name: "index_courses_school_classes_on_course_id"
    t.index ["school_class_id"], name: "index_courses_school_classes_on_school_class_id"
  end

  create_table "expertises", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "expertises_lessons", id: :serial, force: :cascade do |t|
    t.integer "lesson_id", null: false
    t.uuid "expertise_id", null: false
    t.index ["expertise_id", "lesson_id"], name: "index_expertises_lessons_on_expertise_id_and_lesson_id"
    t.index ["lesson_id", "expertise_id"], name: "index_expertises_lessons_on_lesson_id_and_expertise_id"
  end

  create_table "friendly_id_slugs", id: :serial, force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "lessons", id: :serial, force: :cascade do |t|
    t.integer "course_id"
    t.string "title", limit: 255
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position", default: 1
    t.boolean "published", default: false, null: false
  end

  create_table "localities", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "school_type"
    t.string "school_type_custom"
    t.string "school_name"
    t.string "country"
    t.string "state"
    t.string "city"
    t.string "postal_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_localities_on_user_id"
  end

  create_table "posts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.text "teaser_image_data"
    t.text "content"
    t.datetime "released_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "pinned", default: false, null: false
  end

  create_table "preparation_materials", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "topic_id", null: false
    t.integer "medium_type", null: false
    t.string "icon", null: false
    t.string "title", null: false
    t.string "subtitle"
    t.text "description"
    t.string "link", null: false
    t.boolean "published", default: false, null: false
    t.integer "position", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "school_classes", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "metrics", default: {}, null: false
    t.boolean "archived", default: false
    t.index ["metrics"], name: "index_school_classes_on_metrics", using: :gin
    t.index ["user_id", "archived"], name: "index_school_classes_on_user_id_and_archived"
  end

  create_table "teaching_materials", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.integer "lesson_id"
    t.integer "medium_type", null: false
    t.string "title", null: false
    t.integer "position"
    t.string "subtitle"
    t.text "image_data"
    t.string "link", null: false
    t.boolean "lesson_content"
    t.boolean "listing_item"
    t.string "listing_title"
    t.string "listing_icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "topics", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "color"
    t.string "light_color"
    t.text "icon_data"
    t.string "description"
    t.string "slug"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255, null: false
    t.string "encrypted_password", limit: 255, null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip", limit: 255
    t.string "last_sign_in_ip", limit: 255
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "last_name", null: false
    t.boolean "admin", default: false, null: false
    t.string "confirmation_token", limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email", limit: 255
    t.string "subjects", limit: 255
    t.string "first_name", null: false
    t.integer "role", null: false
    t.string "role_custom"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "privacy_policy_accepted_at", null: false
    t.text "referal"
    t.boolean "beta", default: false
    t.string "full_name"
    t.datetime "last_posts_read_at"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
