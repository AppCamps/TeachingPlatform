# frozen_string_literal: true

require 'spec_helper'

describe Locality do
  it { is_expected.to belong_to(:user) }

  describe 'enums' do
    it do
      is_expected.to define_enum_for(:school_type).with(
        school_type_custom: 0,
        school_type_elementary_school: 1,
        school_type_main_school: 2,
        school_type_middle_school: 3,
        school_type_comprehensive_school: 4,
        school_type_academic_high_school: 5,
        school_type_vocational_school: 6,
        school_type_university: 7,
        school_type_special_school: 8
      )
    end
  end

  describe 'validations' do
    let(:locality) { described_class.new }

    before do
      locality.country = :DEU
      locality.user = build(:user, role: :role_teacher)
    end

    context 'with role_teacher' do
      it 'validates locality' do
        locality.user.role = :role_teacher

        expect(locality).to validate_presence_of(:school_type)
        expect(locality).to validate_length_of(:school_name).is_at_most(255)

        locality.school_type = :school_type_university
        expect(locality).to validate_absence_of(:school_type_custom)

        locality.school_type = :school_type_custom
        expect(locality).to validate_presence_of(:school_type_custom)
        expect(locality).to validate_length_of(:school_type_custom).is_at_most(255)
      end
    end

    context 'with role_course_instructor' do
      before { locality.user.role = :role_course_instructor }

      it 'does not validate school_locality' do
        expect(locality).not_to validate_presence_of(:school_name)
        expect(locality).not_to validate_presence_of(:school_type)

        locality.school_type = :school_type_university
        expect(locality).not_to validate_absence_of(:school_type_custom)

        locality.school_type = :school_type_custom
        expect(locality).not_to validate_presence_of(:school_type_custom)
      end

      it 'validates locality' do # rubocop:disable RSpec/MultipleExpectations
        %i[state postal_code city].each do |attribute_name|
          expect(locality).to validate_length_of(attribute_name).is_at_most(255)
        end

        locality.country = :DEU
        expect(locality).to validate_length_of(:state).is_at_most(255)
        expect(locality).to validate_inclusion_of(:country).in_array(CountryService.codes)
        expect(locality).to validate_length_of(:country).is_at_most(255)

        locality.country = (CountryService.codes - Locality::PRIMARY_COUNTRIES).first
        expect(locality).to validate_length_of(:state).is_at_most(255)
        expect(locality).to validate_inclusion_of(:country).in_array(CountryService.codes)
        expect(locality).to validate_length_of(:country).is_at_most(255)
      end
    end

    describe 'postal_code_must_match_country_format' do
      it 'validates german postal_code' do
        locality.country = :DEU
        locality.postal_code = '12345'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = '1234'
        expect(locality).to have(1).errors_on(:postal_code)
        locality.postal_code = '123456'
        expect(locality).to have(1).errors_on(:postal_code)
        locality.postal_code = 'abcdef'
        expect(locality).to have(1).errors_on(:postal_code)
      end

      it 'validates austrian postal_code' do
        locality.country = :AUT
        locality.postal_code = '1234'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = '123'
        expect(locality).to have(1).errors_on(:postal_code)
        locality.postal_code = '12345'
        expect(locality).to have(1).errors_on(:postal_code)
        locality.postal_code = 'abcde'
        expect(locality).to have(1).errors_on(:postal_code)
      end

      it 'validates swiss postal_code' do
        locality.country = :CHE
        locality.postal_code = '1234'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = '123'
        expect(locality).to have(1).errors_on(:postal_code)
        locality.postal_code = '12345'
        expect(locality).to have(1).errors_on(:postal_code)
        locality.postal_code = 'abcde'
        expect(locality).to have(1).errors_on(:postal_code)
      end

      it 'validates other countries' do
        locality.country = (CountryService.codes - Locality::PRIMARY_COUNTRIES).first
        locality.postal_code = '1234'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = '123'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = '12345'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = 'abcde'
        expect(locality).to have(0).errors_on(:postal_code)
        locality.postal_code = nil
        expect(locality).to have(0).errors_on(:postal_code)
      end
    end
  end
end
