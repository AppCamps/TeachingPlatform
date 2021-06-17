# frozen_string_literal: true

module Api
  class PostsController < ApiController
    def index # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
      posts = Post
              .where.not(released_at: nil)
              .where(Arel.sql(`posts.released_at < ?`), Time.zone.now)
              .order(Arel.sql('"posts"."pinned" DESC, "posts"."released_at" DESC'))
              .page(params[:page].try(:[], :number))

      serialization_context = ActiveModelSerializers::SerializationContext.new(request)
      cached_posts = cached(index_cache_key) do
        serialize_json(
          posts,
          serializer_options: {
            each_serializer: PostSerializer
          },
          adapter_options: {
            serialization_context: serialization_context
          }
        )
      end

      render json: cached_posts, status: :ok
    end

    private

    def index_cache_key
      last_post_updated_at = Post.last_updated_at
      return if last_post_updated_at.nil?

      change_date = last_post_updated_at.iso8601
      page_number = params[:page].try(:[], :number) || 1
      cache_key = "/api/posts/#{change_date}/#{page_number}"
      cache_key
    end
  end
end
