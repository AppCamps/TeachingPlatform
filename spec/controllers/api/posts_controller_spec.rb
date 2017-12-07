# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::PostsController, api: :authenticate do
  include ActionView::Helpers::TextHelper

  let(:user) { create(:user) }

  before do
    set_json_api_content_type
    sign_in_user(user)

    Rails.cache.clear
  end

  describe 'GET #index' do
    it_behaves_like 'requires authentication' do
      let(:action) { -> { get :index } }
    end

    it 'returns serialized posts' do
      create_list(:post, 2, :with_teaser_image)

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      posts = document[:data]
      expect(posts.length).to be(2)

      posts.each do |post_data|
        post = Post.find(post_data[:id])
        expect(post_data.dig(:attributes, :title)).to eql(post.title)
        expect(post_data.dig(:attributes, :content)).to eql(post.content)
        expect(post_data.dig(:attributes, :"released-at")).to eql(post.released_at.iso8601)
        expect(post_data.dig(:attributes, :"teaser-image-url")).to eql(post.teaser_image.url)
      end
    end

    it 'only returns post with release date' do
      posts_with_release_date = create_list(:post, 2, :with_teaser_image)
      _post_without_release_date = create(:post, :with_teaser_image, released_at: nil)

      get :index

      expect(response).to have_http_status(:ok)

      document = JSON.parse(response.body).with_indifferent_access

      JSONAPI.parse_response!(document)

      posts = document[:data]
      expect(posts.length).to be(2)

      post_ids = posts.map { |post| post['id'] }
      expect(post_ids).to match_array(posts_with_release_date.map(&:id))
    end

    describe 'cached responses' do
      it 'uses updated_at with page number as cache key' do
        sign_in_user(create(:user, :admin))

        Timecop.freeze do
          post = create(:post)

          expect(controller)
            .to(
              receive(:cached)
                .with("/api/posts/#{Post.last_updated_at.iso8601}/1")
            )

          get :index

          expect(controller)
            .to(
              receive(:cached)
                .with("/api/posts/#{Post.last_updated_at.iso8601}/2")
            )

          get :index, params: { page: { number: 2 } }

          one_week_later = 1.week.from_now
          Timecop.travel(one_week_later) do
            post.touch

            expect(controller)
              .to(
                receive(:cached)
                  .with("/api/posts/#{one_week_later.iso8601}/1")
              )

            get :index
          end
        end
      end

      it 'caches responses' do
        create_list(:post, 2)

        expect(controller).to receive(:serialize_json).once.and_call_original

        get :index

        get :index
      end
    end
  end
end
