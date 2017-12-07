# frozen_string_literal: true

class CourseUploader < Shrine
  plugin :upload_options, store: ->(*) { { acl: 'private' } }
end
