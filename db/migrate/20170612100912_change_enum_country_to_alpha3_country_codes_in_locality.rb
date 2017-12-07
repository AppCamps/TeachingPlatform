# frozen_string_literal: true

class ChangeEnumCountryToAlpha3CountryCodesInLocality < ActiveRecord::Migration[4.2]
  def up; end

  def down
    raise ActiveRecord::IrreversibleMigration
  end

  def data # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    countries = {
      1 => :de,
      2 => :at,
      3 => :ch
    }

    batch_size = 50
    locality_count = 0
    Locality.includes(:user).find_each(batch_size: batch_size).with_index do |locality, index|
      if locality.user.blank?
        locality.destroy
        next
      end

      country = nil
      code = countries[locality.attributes['country']]
      if code
        country = ISO3166::Country.find_country_by_alpha2(code)
        raise "Unknown Country: #{code}" if country.blank?
      else
        country_name =
          case locality.country_custom
          when 'x' then 'Deutschland'
          when 'D' then 'Deutschland'
          when 'US' then 'United States'
          else
            locality.country_custom.strip
          end

        country = ISO3166::Country.find_country_by_name(country_name)
        raise "Unknown Custom Country: #{country_name}. Locality(id: #{locality.id}) User(id: #{locality.user_id})" if country.blank?
      end
      locality.country = 0

      locality.country_custom = country.alpha3

      states = country.states.each_with_object({}) do |(state_code, state), hash|
        names = state.unofficial_names
        hash[state.name] = state_code
        if names.is_a? Array
          state.unofficial_names.each do |s|
            hash[s] = state_code
          end
        else
          hash[names] = state_code
        end
      end
      state_name = locality.state || locality.state_custom.strip
      if locality.state.nil? && states[state_name].nil?
        state_name = case locality.id
                     when '413f3d28-e86f-497c-8b59-3599b1466ef9'
                       'South Denmark'
                     when '64342309-909a-4c59-9cf7-43a17ca8c308'
                       'Nordrhein-Westfalen'
                     when '74035907-d69e-4694-aa5c-d57fcc596c77'
                       'Berlin'
                     when '7558cfda-67b1-4120-af72-b80ce025ecae',
                          '08780629-31e5-4ff8-8f1b-552ce5de6343'
                       'Balears, Illes'
                     when '7aade95c-8f0e-49ec-9877-193fc559679b',
                          'af324451-0340-4008-acbc-ab2da2cc0001',
                          'c5308f33-8b2a-459d-91d5-62dd2c814798'
                       'Liège (fr)'
                     when 'a70a8ee3-f317-4bec-a988-2f706435c29c',
                          'e440679d-7f69-449f-8428-189abcac23ea'
                       'Bolzano'
                     when 'b93af7d4-43c6-4d00-a5f0-58552e2db7fe'
                       'Newfoundland and Labrador'
                     when 'fa540a17-3b3f-429b-bede-925f1fb8973c'
                       'Faro'
                     end
      end

      if states[state_name].present?
        locality.state_custom = states[state_name]
      elsif states.values.uniq.include?(state_name)
        locality.state_custom = state_name
      else
        p states
        p locality
        raise
      end
      locality.state = nil

      locality.save!(validate: false)

      locality_count += 1
      if (index % batch_size).zero?
        p "... processed: #{index} | localities updated: #{locality_count}" unless Rails.env.test?
      end
    end
  end
end
