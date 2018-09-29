# frozen_string_literal: true

class Locality < ApplicationRecord
  PRIMARY_COUNTRIES = %i[DEU AUT CHE].freeze

  enum school_type: {
    school_type_custom: 0,
    school_type_elementary_school: 1,
    school_type_main_school: 2,
    school_type_middle_school: 3,
    school_type_comprehensive_school: 4,
    school_type_academic_high_school: 5,
    school_type_vocational_school: 6,
    school_type_university: 7,
    school_type_special_school: 8
  }

  belongs_to :user

  validates :school_type,
            presence: true,
            if: :user_is_teacher?

  validates :school_name,
            length: { maximum: 255 },
            if: :user_is_teacher?

  validates :school_type_custom,
            length: { maximum: 255 },
            presence: { if: -> { user_is_teacher? && school_type_custom? } },
            absence: { if: -> { user_is_teacher? && !school_type_custom? } }

  validates :postal_code, :city, :country, :state,
            length: { maximum: 255 }

  validates :country, inclusion: { in: CountryService.codes, message: 'is not a valid country' }

  validates :state,
            length: { maximum: 255 },
            inclusion: {
              if: ->(locality) { locality.country_service.try(:states).try(:any?) },
              in: ->(locality) { locality.country_service.states.keys }
            }

  validate :postal_code_must_match_country_format

  def country
    super.try(:to_sym)
  end

  def country_service
    CountryService.find(country)
  end

  private

  def user_is_teacher?
    user.role_teacher?
  end

  def postal_code_must_match_country_format
    return if postal_code.nil?
    regexp = CountryService.find(country).try(:postal_code_format)
    return if regexp.present? && postal_code.to_s.match?(regexp)    
    errors.add(:postal_code, 'invalid postal code')
  end
end
