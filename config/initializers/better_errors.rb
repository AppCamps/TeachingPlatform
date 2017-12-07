# frozen_string_literal: true

if defined? BetterErrors
  # rubocop:disable Style/FormatStringToken
  BetterErrors.editor = 'atm://open?url=file://%{file}&line=%{line}'
end
