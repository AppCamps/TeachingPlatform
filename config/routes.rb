# frozen_string_literal: true

Rails.application.routes.draw do
  def subdomain_constraint(request, *subdomains)
    first_subdomain = request.subdomain.split('.').first
    first_subdomain.in?(subdomains.map(&:to_s))
  end

  # needed to inject devise helpers to controllers...
  devise_for :users, skip: :all

  constraints ->(request) { subdomain_constraint(request, :admin) } do
    authenticate :user, ->(user) { user.admin? } do
      mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
      mount Blazer::Engine, at: 'blazer'
    end
  end
  
  api_routes = proc do
    default_url_options host: Rails.application.secrets.api_domain

    resource :session, only: %i[create show destroy]
    resources :courses, only: [:index]
    resources :course_school_classes, only: [:update]
    resources :countries, only: [:index]
    resources :preparation_materials, only: [:index]
    resource :user, only: %i[create update]
    resource :locality, only: [:create]
    resources :posts, only: [:index]
    resources :classes, controller: :school_classes, only: %i[index update create] do
      member do
        scope :relationships do
          put :completed_lessons,
              path: 'completed-lessons',
              action: :update_completed_lessons_relationship

          delete :completed_lessons,
                 path: 'completed-lessons',
                 action: :destroy_completed_lessons_relationship
        end
      end
    end

    # non-jsonapi endpoints
    resources :password_reset, path: 'password-reset',
                               only: %i[create update],
                               param: :reset_password_token
    resources :confirmations, only: %i[create update],
                              param: :confirmation_token

    # dirty json responses for api route errors
    match '*route', to: 'api#handle_not_found', via: :all
  end

  constraints ->(request) { subdomain_constraint(request, :teach) } do
    namespace(:api, &api_routes)

    get '*other', to: 'teach#render_app'
    root to: 'teach#render_app', via: :get, as: :teach_root
  end

  root to: redirect("http://#{Rails.application.secrets.domain}"), via: :get
end
