# frozen_string_literal: true

ActiveSupport.on_load(:action_controller) do
  ActiveModelSerializers.config.adapter = :json_api
end
