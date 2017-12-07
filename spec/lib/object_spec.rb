# frozen_string_literal: true

require 'spec_helper'

describe Object do
  before { stub_const('ENV', 'smth' => 'hello') }

  it 'returns environment variables' do
    expect(fetch_from_env('smth')).to eql('hello')
  end

  it 'returns environment variables with sym parameter' do
    expect(fetch_from_env(:smth)).to eql('hello')
  end

  it 'raises error if env variable is not present' do
    expect { fetch_from_env(:smth_else) }
      .to raise_error EnvVarNotFoundError
  end
end
