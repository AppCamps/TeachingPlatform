# frozen_string_literal: true

class PostUploader < Shrine
    plugin :cached_attachment_data
end
