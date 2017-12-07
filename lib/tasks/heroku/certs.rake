# frozen_string_literal: true

require 'pathname'

namespace :certs do
  desc 'Write certificates from env to disk'
  task :write do
    certificates_defintions = {
      'MYSQL_SERVER_CERTIFICATE' => './certs/mysql/server-ca.pem',
      'MYSQL_CLIENT_CERTIFICATE' => './certs/mysql/client-cert.pem',
      'MYSQL_CLIENT_KEY' => './certs/mysql/client-key.pem'
    }

    certificates_defintions.each do |(env_name, filename)|
      path = Pathname.new(filename)
      path.dirname.mkpath unless path.dirname.exist?
      File.open(filename, 'w') { |file| file.write(ENV.fetch(env_name)) }
      Rails.logger.info "Wrote #{env_name} to #{filename}"
    end
  end
end

# quick fix: persist certificates on heroku deploy
Rake::Task['certs:write'].enhance [:synchronous_error_reporting]
Rake::Task['assets:precompile'].enhance ['certs:write']
