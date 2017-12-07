# frozen_string_literal: true

Rails.application.config.after_initialize do
  RailsAdmin.config do |config|
    ### Popular gems integration

    ## == Devise ==
    config.authenticate_with do
      warden.authenticate! scope: :user
    end
    config.current_user_method(&:current_user)

    config.authorize_with do
      redirect_to main_app.root_path unless warden.user.admin?
    end

    models = %w[
      CommonMistake
      Course
      CourseSchoolClass
      Expertise
      Lesson
      Locality
      Post
      PreparationMaterial
      SchoolClass
      TeachingMaterial
      Topic
      User
    ]

    config.included_models = models

    models.each do |model_klass|
      config.model model_klass do
        list do
          sort_by { :created_at }
        end
      end
    end

    RailsAdmin::Config::Fields::Types.register(:asset, Types::Asset)
    RailsAdmin::Config::Fields::Types.register(:nilified_string, Types::NilifiedString)
    config.model 'User' do
      edit do
        configure :confirmation_token, :nilified_string
        configure :reset_password_token, :nilified_string
      end
      export do
        field :created_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        field :updated_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        field :remember_created_at do
          export_value do
            value&.to_formatted_s(:db)
          end
        end
        field :confirmed_at do
          export_value do
            value&.to_formatted_s(:db)
          end
        end
        field :confirmation_sent_at do
          export_value do
            value&.to_formatted_s(:db)
          end
        end
        # Nested fields (for relationships)
        field :current_locality do
          export_value do
            field :created_at do
              export_value do
                value&.to_formatted_s(:db)
              end
            end
            field :updated_at do
              export_value do
                value&.to_formatted_s(:db)
              end
            end
          end
        end
        field :localities do
          export_value do
            field :created_at do
              export_value do
                value&.to_formatted_s(:db)
              end
            end
            field :updated_at do
              export_value do
                value&.to_formatted_s(:db)
              end
            end
          end
        end
        include_all_fields
      end
    end

    config.model 'Course' do
      export do
        field :created_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        field :updated_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        include_all_fields
      end

      edit do
        configure :certificate, :asset
        configure :certificate_data do
          hide
        end
      end
    end

    config.model 'Locality' do
      export do
        field :created_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        field :updated_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        include_all_fields
      end
    end

    config.model 'Chapter' do
      export do
        field :created_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        field :updated_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        include_all_fields
      end
    end

    config.model 'SchoolClass' do
      configure :metrics do
        hide
      end
      configure :resource_type, :string
      configure :girl_count, :string
      configure :boy_count, :string
      configure :class_name, :string
      configure :school_year, :string
      configure :grade, :string
      configure :planned_school_usage, :string
      configure :school_subject, :string
      configure :group_name, :string
      configure :year, :string
      configure :age, :string
      configure :planned_extracurricular_usage, :string
      export do
        field :created_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        field :updated_at do
          export_value do
            value.to_formatted_s(:db)
          end
        end
        include_all_fields
      end
    end

    config.model 'Topic' do
      configure :color, :color
      configure :light_color, :color
      configure :icon, :asset
      configure :icon_data do
        hide
      end
      configure :published_courses do
        hide
      end
      configure :published_preparation_materials do
        hide
      end
    end

    config.model 'TeachingMaterial' do
      edit do
        configure :image, :asset
        configure :image_data do
          hide
        end
      end
    end

    config.model 'Post' do
      edit do
        configure :content, :wysihtml5 do
          config_options toolbar: { fa: true },
                         html: true,
                         parserRules: {
                           tags: { p: 1 }
                         }
        end

        configure :teaser_image, :asset
        configure :teaser_image_data do
          hide
        end
      end
    end

    ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration
    #
    # config.actions do
    #   dashboard                     # mandatory
    #   index                         # mandatory
    #   new
    #   export
    #   bulk_delete
    #   show
    #   edit
    #   delete
    #   show_in_app
    # end
  end
end
