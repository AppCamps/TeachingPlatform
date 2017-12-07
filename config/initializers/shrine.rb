# frozen_string_literal: true

if Rails.env.test?
  require 'shrine/storage/file_system'

  Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/cache'),
    store: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/store')
  }
else
  require 'shrine/storage/s3'

  s3_options = {
    access_key_id:     Rails.application.secrets.aws_key,
    secret_access_key: Rails.application.secrets.aws_secret_key,
    region:            Rails.application.secrets.aws_region,
    bucket:            Rails.application.secrets.aws_bucket
  }

  Shrine.storages = {
    cache: Shrine::Storage::S3.new(prefix: 'cache', **s3_options),
    store: Shrine::Storage::S3.new(prefix: 'store', **s3_options)
  }
end

Shrine.plugin :activerecord
Shrine.plugin :cached_attachment_data
Shrine.plugin :remove_attachment
Shrine.plugin :determine_mime_type
