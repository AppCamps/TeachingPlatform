# frozen_string_literal: true

require 'spec_helper'

describe 'api routing to school_classes' do
  it 'routes /classes to school_classes#index' do
    assert_generates(
      '/api/classes',
      controller: 'api/school_classes',
      action: 'index'
    )
  end

  it 'routes /classes to school_classes#create' do
    assert_generates(
      '/api/classes',
      controller: 'api/school_classes',
      action: 'create'
    )
  end

  it 'routes PUT /classes/:id/relationships/completed-lessons to school_classes#update_completed_lessons_relationship' do # rubocop:disable LineLength
    uuid = SecureRandom.uuid
    assert_generates(
      "/api/classes/#{uuid}/relationships/completed-lessons",
      controller: 'api/school_classes',
      action: 'update_completed_lessons_relationship',
      id: uuid
    )
  end

  it 'routes DELETE /classes/:id/relationships/completed-lessons to school_classes#update_completed_lessons_relationship' do # rubocop:disable LineLength
    uuid = SecureRandom.uuid
    assert_generates(
      "/api/classes/#{uuid}/relationships/completed-lessons",
      controller: 'api/school_classes',
      action: 'destroy_completed_lessons_relationship',
      id: uuid
    )
  end
end
