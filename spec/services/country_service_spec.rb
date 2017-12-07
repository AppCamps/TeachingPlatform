# frozen_string_literal: true

require 'spec_helper'

describe CountryService do
  describe '#self.codes' do
    it 'returns all alpha3 codes for countries' do
      codes = described_class.codes

      expect(codes.count).to be(249)
      expect(codes.count).to eql(described_class.all.count)

      example_alpha3 = codes.sample
      expect(example_alpha3).to be_a(Symbol)
      expect(example_alpha3.length).to be(3)
    end
  end

  describe '#self.find' do
    it 'finds country service instance for alpha3' do
      alpha3 = described_class.all.sample.alpha3
      country = described_class.find(alpha3)

      expect(country).to be_a(described_class)
      expect(country.alpha3).to eql(alpha3)
    end
  end

  describe '#self.all' do
    it 'returns CountryService instance for all countries' do
      expect(described_class.all.count).to be(249)
      expect(described_class.all.sample).to be_a(described_class)
    end
  end

  describe '#initialize' do
    it 'works' do
      expect(-> { described_class.new(:DEU) }).not_to raise_error
      expect(-> { described_class.new(:other) }).not_to raise_error
    end
  end

  describe '#alpha3' do
    it 'returns country_alpha3 from initialize' do
      expect(described_class.new(:DEU).alpha3).to be(:DEU)
      expect(described_class.new(:other).alpha3).to be(:OTHER)
    end
  end

  describe '#states' do
    it 'returns states with keys for countries' do
      expect(described_class.new(:DEU).states).to include('BW' => 'Baden-Württemberg')
    end

    it 'returns nil for :other or :country_custom' do
      expect(described_class.new(:other).states).to be(nil)
      expect(described_class.new(:country_custom).states).to be(nil)
    end
  end

  describe '#postal_code_format' do
    it 'returns the right regexps' do
      expect(described_class.new(:DEU).postal_code_format).to eql(/^[0-9]{5}$/)
      expect(described_class.new(:AUT).postal_code_format).to eql(/^[0-9]{4}$/)
      expect(described_class.new(:CHE).postal_code_format).to eql(/^[0-9]{4}$/)
      expect(described_class.new(:USA).postal_code_format).to eql(/^.*$/)
      expect(described_class.new(:other).postal_code_format).to be(nil)
    end
  end
end
