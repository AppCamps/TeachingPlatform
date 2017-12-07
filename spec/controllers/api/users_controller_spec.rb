# frozen_string_literal: true

require 'spec_helper'
require 'support/shared_examples/controllers/api/requires_authentication'

describe Api::UsersController, api: :authenticate do
  before do
    set_json_api_content_type
  end

  describe 'POST #create' do
    let(:user_attributes) do
      attributes_for(:user_registration)
        .except(:gender, :gender_custom, :role_custom, :date_of_birth, :confirmed_at)
    end

    it 'creates user with values and sends email' do
      Timecop.freeze do
        expect do
          perform_enqueued_jobs do
            post :create,
                 params: {
                   data: {
                     attributes: user_attributes.stringify_keys.transform_keys(&:dasherize)
                   }
                 }
          end
        end.to change { MandrillMailer.deliveries.count }.by(1)

        expect(response).to have_http_status(:created)

        user = User.last

        user_attributes.except(:password, :password_confirmation).each do |key, value|
          expect(user.send(key)).to eql(value)
        end

        expect(user.privacy_policy_accepted).to be(true)
        expect(user.privacy_policy_accepted_at.to_i).to eql(Time.zone.now.to_i)

        result = JSON.parse(response.body).deep_symbolize_keys
        rendered_attributes = result.dig(:data, :attributes)

        user_attributes
          .except(:password, :password_confirmation, :last_name, :referal, :role)
          .stringify_keys.transform_keys(&:dasherize)
          .symbolize_keys
          .each do |key, value|
            expect(rendered_attributes[key]).to eql(value)
          end
        expect(rendered_attributes[:'privacy-policy-accepted']).to be(true)

        expect(MandrillMailer.deliveries.last.message['subject'])
          .to eql(I18n.with_locale(:de) do
            I18n.t('mailers.user_mailer.welcome.subject')
          end)
      end
    end

    it 'fails if privacy policy is not accepted' do
      user_attributes[:privacy_policy_accepted] = false
      post :create,
           params: {
             data: {
               attributes: user_attributes.stringify_keys.transform_keys(&:dasherize)
             }
           }

      expect(response).to have_http_status(:unprocessable_entity)
      result = JSON.parse(response.body).deep_symbolize_keys

      expect(result[:errors].first.dig(:source, :pointer)).to match(/privacy-policy-accepted/)
      expect(User.count).to be(0)
    end

    it 'fails for all required attributes' do
      user_attributes.each_key do |key|
        post :create,
             params: {
               data: {
                 attributes: user_attributes.except(key).stringify_keys.transform_keys(&:dasherize)
               }
             }

        expect(response).to have_http_status(:unprocessable_entity)

        result = JSON.parse(response.body).deep_symbolize_keys
        expect(result[:errors].first.dig(:source, :pointer)).to match(/#{key.to_s.dasherize}/)
      end
    end

    it 'fails if email is already taken' do
      User.create(user_attributes)

      post :create,
           params: {
             data: {
               attributes: user_attributes.stringify_keys.transform_keys(&:dasherize)
             }
           }

      expect(response).to have_http_status(:unprocessable_entity)

      result = JSON.parse(response.body).deep_symbolize_keys
      expect(result[:errors].first.dig(:source, :pointer)).to match(/email/)
    end
  end

  describe 'PATCH #update' do
    let(:user) do
      create(:user)
    end

    before { sign_in_user(user) }

    it_behaves_like 'requires authentication' do
      let(:action) { -> { patch :update } }
    end

    describe 'update privacy_policy_accepted_at' do
      it 'update privacy_policy_accepted_at' do
        Timecop.freeze do
          user.update(privacy_policy_accepted_at: User::LAST_PRIVACY_POLICY_UPDATE - 1.day)

          expect(user.privacy_policy_accepted).to be(false)

          patch :update,
                params: {
                  data: {
                    attributes: {
                      'privacy-policy-accepted': true
                    }
                  }
                }

          result = JSON.parse(response.body).deep_symbolize_keys

          expect(response).to have_http_status(:ok)

          user.reload

          expect(user.privacy_policy_accepted).to be(true)
          expect(user.privacy_policy_accepted_at.to_i).to be_within(1.second).of(Time.zone.now.to_i)

          privacy_policy_accepted = result.dig(:data, :attributes, :'privacy-policy-accepted')
          expect(privacy_policy_accepted).to be(true)
        end
      end

      it 'does not update privacy_policy_accepted_at if privacy_policy_accepted is already true' do
        Timecop.freeze User::LAST_PRIVACY_POLICY_UPDATE do
          user.update(privacy_policy_accepted_at: 1.day.from_now)

          Timecop.travel 2.days.from_now

          expect(user.privacy_policy_accepted).to be(true)

          patch :update,
                params: {
                  data: {
                    attributes: {
                      'privacy-policy-accepted': true
                    }
                  }
                }

          expect(response).to have_http_status(:ok)

          user.reload

          expect(user.privacy_policy_accepted).to be(true)
          expect(user.privacy_policy_accepted_at)
            .to be_within(1.second).of(User::LAST_PRIVACY_POLICY_UPDATE + 1.day)

          result = JSON.parse(response.body).deep_symbolize_keys
          privacy_policy_accepted = result.dig(:data, :attributes, :'privacy-policy-accepted')
          expect(privacy_policy_accepted).to be(true)
        end
      end
    end

    describe 'update unread_posts_present' do
      it 'does update unread_posts_present' do
        Timecop.freeze do
          create(:post)
          expect(user.unread_posts_present?).to be(true)

          patch :update,
                params: {
                  data: {
                    attributes: {
                      'unread-posts-present': false
                    }
                  }
                }

          expect(response).to have_http_status(:ok)

          user.reload

          expect(user.unread_posts_present?).to be(false)

          result = JSON.parse(response.body).deep_symbolize_keys
          serialized_result = result.dig(:data, :attributes, :'unread-posts-present')
          expect(serialized_result).to be(false)
        end
      end

      it 'does not change unread_posts_present if already false' do
        Timecop.freeze do
          expect(user.unread_posts_present?).to be(false)

          patch :update,
                params: {
                  data: {
                    attributes: {
                      'unread-posts-present': false
                    }
                  }
                }

          expect(response).to have_http_status(:ok)

          user.reload

          expect(user.unread_posts_present?).to be(false)

          result = JSON.parse(response.body).deep_symbolize_keys
          serialized_result = result.dig(:data, :attributes, :'unread-posts-present')
          expect(serialized_result).to be(false)
        end
      end

      it 'does not change unread_posts_present to true' do
        Timecop.freeze do
          expect(user.unread_posts_present?).to be(false)

          patch :update,
                params: {
                  data: {
                    attributes: {
                      'unread-posts-present': true
                    }
                  }
                }

          expect(response).to have_http_status(:ok)

          user.reload

          expect(user.unread_posts_present?).to be(false)

          result = JSON.parse(response.body).deep_symbolize_keys
          serialized_result = result.dig(:data, :attributes, :'unread-posts-present')
          expect(serialized_result).to be(false)
        end
      end
    end

    describe 'user data' do
      it 'update email, first_name, last_name' do
        old_email = user.email
        new_user = attributes_for(:user)

        patch :update,
              params: {
                data: {
                  attributes: {
                    email: new_user[:email],
                    'first-name': new_user[:first_name],
                    'last-name': new_user[:last_name]
                  }
                }
              }

        expect(response).to have_http_status(:ok)
        user.reload

        expect(user.email).to eql(old_email)
        expect(user.unconfirmed_email).to eql(new_user[:email])
        expect(user.first_name).to eql(new_user[:first_name])
        expect(user.last_name).to eql(new_user[:last_name])
      end

      it 'resets unconfirmed_email and confirmation_token when sending confirmed email' do
        previous_email = user.email
        user.update(email: 'test@test.de')
        expect(user.unconfirmed_email).to eql('test@test.de')

        patch :update,
              params: {
                data: {
                  attributes: {
                    email: previous_email
                  }
                }
              }

        expect(response).to have_http_status(:ok)
        user.reload

        expect(user.email).to eql(previous_email)
        expect(user.unconfirmed_email).to be(nil)
        expect(user.confirmation_token).to be(nil)
      end

      it 'fails for all required attributes' do
        user_attributes = attributes_for(:user).extract!(%i[email first_name last_name])

        attributes_hash = user_attributes.stringify_keys.transform_keys(&:dasherize)

        user_attributes.each_key do |key|
          hash_for_key = attributes_hash.clone
          hash_for_key[key.to_s.dasherize] = ''
          patch :update,
                params: {
                  data: {
                    attributes: hash_for_key
                  }
                }
          expect(response).to have_http_status(:unprocessable_entity)

          result = JSON.parse(response.body).deep_symbolize_keys
          expect(result[:errors].first.dig(:source, :pointer)).to match(/#{key.to_s.dasherize}/)
        end
      end
    end

    describe 'password change' do
      it 'changes password' do
        user.update(
          password: 'asdasdasd',
          password_confirmation: 'asdasdasd'
        )

        # session invalidates after password change
        sign_in_user(user)
        expect(controller).to(
          receive(:bypass_sign_in).with(an_instance_with_id(User, user.id)).and_call_original
        )
        patch :update,
              params: {
                data: {
                  attributes: {
                    'current-password': 'asdasdasd',
                    password: 'password',
                    'password-confirmation': 'password'
                  }
                }
              }

        expect(response).to have_http_status(:ok)
        user.reload

        expect(user.valid_password?('password')).to be(true)
      end

      it 'uses update_with_password if password_change?' do
        expect_any_instance_of(User).to receive(:update_with_password).and_call_original

        patch :update,
              params: {
                data: {
                  attributes: {
                    'current-password': user.password,
                    password: 'password',
                    'password-confirmation': 'password'
                  }
                }
              }
      end

      it 'fails if current_password is not provided' do
        patch :update,
              params: {
                data: {
                  attributes: {
                    password: 'test1234',
                    'password-confirmation': 'test1234'
                  }
                }
              }

        expect(response).to have_http_status(:unprocessable_entity)

        result = JSON.parse(response.body).deep_symbolize_keys
        expect(result[:errors].first.dig(:source, :pointer)).to match(/current-password/)
      end

      it 'fails for all required attributes' do
        user_attributes =
          attributes_for(:user).extract!(%i[current_password password password_confirmation])

        attributes_hash = user_attributes.stringify_keys.transform_keys(&:dasherize)

        user_attributes.each_key do |key|
          hash_for_key = attributes_hash.clone
          hash_for_key[key.to_s.dasherize] = ''
          patch :update,
                params: {
                  data: {
                    attributes: hash_for_key
                  }
                }
          expect(response).to have_http_status(:unprocessable_entity)

          result = JSON.parse(response.body).deep_symbolize_keys
          expect(result[:errors].first.dig(:source, :pointer)).to match(/#{key.to_s.dasherize}/)
        end
      end
    end

    it 'serializes user' do
      Timecop.freeze do
        patch :update,
              params: {
                data: {
                  attributes: {
                    'privacy-policy-accepted': true
                  }
                }
              }

        expect(response).to have_http_status(:ok)

        user.reload

        result = JSON.parse(response.body)
                     .dig('data', 'attributes')
                     .deep_transform_keys(&:underscore)

        expect(UserSerializer.new(user).as_json.deep_stringify_keys)
          .to include(result)
      end
    end
  end
end
