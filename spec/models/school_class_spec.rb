# frozen_string_literal: true

require 'spec_helper'

describe SchoolClass do
  describe 'relations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:course_school_classes).dependent(:destroy) }
    it { is_expected.to have_many(:courses).through(:course_school_classes) }

    describe 'locality' do
      it 'returns nil if no locality is present' do
        user = create(:user, current_locality: nil)
        school_class = create(:school_class, :class, user: user)

        expect(school_class.locality). to be(nil)
      end

      it 'returns last locality that has been created before school_class' do
        user = create(:user)

        create(:locality, user: user, created_at: 1.day.ago)
        current_locality = create(:locality, user: user)
        create(:locality, user: create(:user), created_at: 1.9.days.ago)
        school_class_locality = create(:locality, user: user, created_at: 2.days.ago)
        oldest_locality = create(:locality, user: user, created_at: 5.days.ago)

        school_class = create(:school_class, :class, user: user, created_at: 1.5.days.ago)
        brandnew_school_class = create(:school_class, :class, user: user)
        very_old_school_class = create(:school_class, :class, user: user, created_at: 15.days.ago)

        expect(school_class.locality).to eql(school_class_locality)
        expect(brandnew_school_class.locality).to eql(current_locality)
        expect(very_old_school_class.locality).to eql(oldest_locality)
      end
    end
  end

  [
    SchoolClass::BASE_PROPERTIES,
    SchoolClass::SCHOOL_CLASS_PROPERTIES,
    SchoolClass::EXTRACURRICULAR_PROPERTIES
  ].flatten.each do |property|
    it "#{property} exists" do
      school_class = build(:school_class)
      expect { school_class.send(property) }.not_to raise_error
    end
  end

  describe 'validation' do
    it 'resource_type' do
      is_expected.to(
        validate_inclusion_of(:resource_type)
        .in_array(SchoolClass::RESOURCE_TYPES)
      )
    end

    %i[girl_count boy_count].each do |attribute|
      it(attribute) do
        is_expected.to(
          validate_numericality_of(attribute)
            .only_integer
            .is_greater_than_or_equal_to(0)
            .is_less_than_or_equal_to(999)
        )
      end

      it "normalizes blank values for #{attribute} to nil" do
        school_class = create(:school_class, :class, Hash[attribute, ''])
        expect(school_class.send(attribute)).to be(nil)
      end
    end

    describe 'school_class' do
      let(:subject) { build(:school_class, resource_type: SchoolClass::SCHOOL_CLASS) }

      it { is_expected.to validate_presence_of(:class_name) }
      it { is_expected.to validate_presence_of(:school_year) }
      it { is_expected.not_to validate_presence_of(:group_name) }
      it { is_expected.not_to validate_presence_of(:year) }

      it 'planned_school_usage' do
        is_expected.to allow_value(nil).for(:planned_school_usage)
        is_expected.to(
          validate_inclusion_of(:planned_school_usage)
            .in_array(SchoolClass::PLANNED_SCHOOL_USAGE)
            .allow_blank
        )
      end

      it 'normalizes blank values to nil' do
        school_class = create(:school_class, :class, Hash[:planned_school_usage, ''])
        expect(school_class.planned_school_usage).to be(nil)
      end
    end

    describe 'extracurricular' do
      let(:subject) { build(:school_class, resource_type: SchoolClass::EXTRACURRICULAR) }

      it { is_expected.to validate_presence_of(:group_name) }
      it { is_expected.to validate_presence_of(:year) }
      it { is_expected.not_to validate_presence_of(:class_name) }
      it { is_expected.not_to validate_presence_of(:school_year) }
    end
  end
end
