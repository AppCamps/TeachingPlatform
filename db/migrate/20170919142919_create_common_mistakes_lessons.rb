# frozen_string_literal: true

class CreateCommonMistakesLessons < ActiveRecord::Migration[5.1]
  def change
    create_table :common_mistakes_lessons, id: :uuid, default: 'uuid_generate_v4()' do |t|
      t.references :common_mistake, type: :uuid
      t.references :lesson
      t.timestamps
    end
  end

  def data
    CommonMistake.all.each do |common_mistake|
      common_mistake.common_mistake_lessons.create(
        lesson_id: common_mistake.lesson_id
      )
    end
  end
end
