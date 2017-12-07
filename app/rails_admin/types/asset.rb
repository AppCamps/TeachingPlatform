
# frozen_string_literal: true

module Types
  class Asset < RailsAdmin::Config::Fields::Types::FileUpload
    register_instance_option :delete_method do
      "remove_#{name}"
    end

    register_instance_option :cache_method do
      "cached_#{name}_data"
    end

    def resource_url(_thumb = nil)
      value.try(:url, public: true)
    end
  end
end
