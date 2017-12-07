# frozen_string_literal: true

module Api
  class PreparationMaterialsController < ApiController
    def index # rubocop:disable Metrics/MethodLength
      topics = if current_user.admin? || current_user.beta?
                 Topic.eager_load(:preparation_materials)
               else
                 Topic.joins(:published_courses)
                      .eager_load(:published_preparation_materials)
               end

      cached_topics = cached(index_cache_key) do
        serialize_json(
          topics,
          serializer_options: {
            each_serializer: TopicSerializer
          },
          adapter_options: {
            include: [:preparation_materials]
          }
        )
      end

      render json: cached_topics, status: :ok
    end

    private

    def index_cache_key
      last_changed_topic = Topic.order(updated_at: :desc).first
      return if last_changed_topic.nil?

      cache_key = "/api/preparation-materials/#{last_changed_topic.updated_at.iso8601}"
      cache_key = "#{cache_key}-unpublished" if current_user.admin? || current_user.beta?
      cache_key
    end
  end
end
