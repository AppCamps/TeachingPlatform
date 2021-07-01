class DropThredded < ActiveRecord::Migration[5.2]
  def change
    drop_table :thredded_categories, force: :cascade, if_exists: true
    drop_table :thredded_messageboards, force: :cascade, if_exists: true
    drop_table :thredded_posts, force: :cascade, if_exists: true
    drop_table :thredded_private_posts, force: :cascade, if_exists: true
    drop_table :thredded_private_topics, force: :cascade, if_exists: true
    drop_table :thredded_private_users, force: :cascade, if_exists: true
    drop_table :thredded_topic_categories, force: :cascade, if_exists: true
    drop_table :thredded_topics, force: :cascade, if_exists: true
    drop_table :thredded_user_details, force: :cascade, if_exists: true
    drop_table :thredded_messageboard_users, force: :cascade, if_exists: true
    drop_table :thredded_user_preferences, force: :cascade, if_exists: true
    drop_table :thredded_user_messageboard_preferences, force: :cascade, if_exists: true
    drop_table :thredded_user_topic_read_states, force: :cascade, if_exists: true
    drop_table :thredded_user_private_topic_read_states, force: :cascade, if_exists: true
    drop_table :thredded_messageboard_groups, force: :cascade, if_exists: true
    drop_table :thredded_user_topic_follows, force: :cascade, if_exists: true
    drop_table :thredded_post_moderation_records, force: :cascade, if_exists: true
    drop_table :thredded_notifications_for_private_topics, force: :cascade, if_exists: true
    drop_table :thredded_notifications_for_followed_topics, force: :cascade, if_exists: true
    drop_table :thredded_messageboard_notifications_for_followed_topics, force: :cascade, if_exists: true
    drop_table :thredded_user_post_notifications, force: :cascade, if_exists: true
  end
end
