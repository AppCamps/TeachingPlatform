# frozen_string_literal: true

module Support
  module Controller
    module Api
      module ContentType
        def set_json_api_content_type
          request.content_type = Mime[:jsonapi].to_s
        end

        def sign_in_user(login_user = nil)
          login_user ||= create(:user)

          login_user.remember_me = true
          sign_in(login_user)

          # save remember_created_at
          login_user.remember_created_at = Time.zone.now
          login_user.save! if login_user.persisted?
        end
      end

      module Authorization
        shared_context 'when api requires authentication' do
          it_behaves_like 'requires authentication'

          before do
            set_json_api_content_type
          end
        end
      end
    end
  end
end
