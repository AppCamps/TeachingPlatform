# frozen_string_literal: true

module Rack
  class Attack
    ### Throttle Spammy Clients ###

    # If any single client IP is making tons of requests, then they're
    # probably malicious or a poorly-configured scraper. Either way, they
    # don't deserve to hog all of the app server's CPU. Cut them off!
    #
    # Note: If you're serving assets through rack, those requests may be
    # counted by rack-attack and this throttle may be activated too
    # quickly. If so, enable the condition to exclude them from tracking.

    # Throttle all api requests by IP (60rpm)
    #
    # Key: "rack::attack:#{Time.now.to_i/:period}:req/ip:#{req.ip}"
    throttle('api/ip', limit: 10, period: 10.seconds) do |req|
      req.ip if req.path.start_with?('/api')
    end

    # Higher limit for general requests, so we can display error message in frontend
    throttle('request/ip', limit: 15, period: 10.seconds) do |req|
      req.ip unless req.path.start_with?('/frontend', '/assets')
    end

    ### Prevent Brute-Force Login Attacks ###

    # The most common brute-force login attack is a brute-force password
    # attack where an attacker simply tries a large number of emails and
    # passwords to see if any credentials match.
    #
    # Another common method of attack is to use a swarm of computers with
    # different IPs to try brute-forcing a password for a specific account.

    # Throttle POST requests to /login by IP address
    #
    # Key: "rack::attack:#{Time.now.to_i/:period}:logins/ip:#{req.ip}"
    throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
      req.ip if req.path == '/api/session' && req.post?
    end

    # Throttle POST requests to /login by email param
    #
    # Key: "rack::attack:#{Time.now.to_i/:period}:logins/email:#{req.email}"
    #
    # Note: This creates a problem where a malicious user could intentionally
    # throttle logins for another user and force their login requests to be
    # denied, but that's not very common and shouldn't happen to you. (Knock
    # on wood!)
    throttle('logins/email', limit: 5, period: 20.seconds) do |req|
      email = begin
        if req.path == '/api/session' && req.post?
          request_body = req.body.gets
          req.body.rewind
          JSON.parse(request_body).dig('data', 'attributes', 'email')
        end
      rescue JSON::ParserError
        nil
      end

      email.presence if req.path == '/api/session' && req.post?
    end

    # Throttle POST requests to /api/user by ip
    #
    # Key: "rack::attack:#{Time.now.to_i/:period}:api/user/ip:#{req.ip}"
    throttle('api/user/ip', limit: 10, period: 1.hour) do |req|
      req.ip if req.path == '/api/user' && req.post?
    end
  end
end
