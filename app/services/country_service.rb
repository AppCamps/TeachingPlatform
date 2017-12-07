# frozen_string_literal: true

class CountryService
  UnknownCountryCodeError = Class.new(StandardError)
  include Enumerable

  LOCALE = :de

  attr_reader :alpha3, :name, :states, :postal_code_format
  alias_attribute :id, :alpha3

  delegate :each, to: :all

  class << self
    def find(code)
      all.find do |country|
        code.present? && country.alpha3 == code.to_sym
      end
    end

    def all
      @all ||= ISO3166::Country.all.map { |c| c.alpha3.to_sym }.map do |country_code|
        CountryService.new(country_code.downcase)
      end
    end

    def codes
      @codes ||= all.map(&:alpha3)
    end
  end

  def initialize(alpha3)
    @alpha3 = alpha3.upcase.to_sym
    initialize_country_gem_instance
  end

  def read_attribute_for_serialization(attributes_name)
    send(attributes_name)
  end

  private

  def initialize_country_gem_instance # rubocop:disable Metrics/MethodLength
    alpha2 = ISO3166::Country.find_by_alpha3(alpha3).try(:first) # rubocop:disable Rails/DynamicFindBy, Metrics/LineLength
    country_gem_instance = ISO3166::Country.new(alpha2)

    return if country_gem_instance.nil?

    @name = country_gem_instance.try(:translation, LOCALE)
    @states = begin
      return nil if country_gem_instance.blank?

      state_definition = country_gem_instance.states
      state_definition.each_with_object({}) do |(key, definition), states_translations|
        states_translations[key] = definition['name']
      end
    end
    @postal_code_format = begin
      case alpha3
      when :DEU
        /^[0-9]{5}$/
      when :AUT, :CHE
        /^[0-9]{4}$/
      else
        /^.*$/
      end
    end
  end
end
