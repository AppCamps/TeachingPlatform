# frozen_string_literal: true

module Types
  class Asset < RailsAdmin::Config::Fields::Types::FileUpload
    register_instance_option :delete_method do
      "remove_#{name}"
    end

    def resource_url(_thumb = nil)
      value.try(:url, public: true)
    end
  end
end
