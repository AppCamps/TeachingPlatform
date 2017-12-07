# frozen_string_literal: true

class JsonApiSerializerService
  def initialize(resource)
    @resource = resource
    @serializer_klass = ActiveModel::Serializer.serializer_for(resource)
  end

  def serializer(adapter_options: {}, serializer_options: {})
    ActiveModelSerializers::Adapter.create(
      serializer_instance(serializer_options),
      adapter_options
    )
  end

  def as_json(*args)
    serializer(*args).as_json
  end

  private

  def serializer_instance(serializer_options)
    @serializer_klass.new(@resource, serializer_options)
  end
end
