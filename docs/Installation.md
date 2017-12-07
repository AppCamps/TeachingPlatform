## Installation

### Installation (macOS)

Run the following instructions in Terminal.

1. [Get Homebrew](http://brew.sh/)  
1. Install dependencies  
```brew install postgresql@9.6 mysql rbenv ruby-build nvm openssl yarn```
1. Checkout repo  
```git clone git@github.com:AppCamps/www.git```
1. Change into project directory  
```cd www```
1. Install ruby & node  
```rbenv install && nvm install```
1. Install bundler & needed gems  
```gem install bundler && bundle install --path vendor/bundle```
1. Install node modules  
```yarn install```
1. Copy .env.example afterwards and adjust env variables  
```cp .env.example .env && $EDITOR .env```
1. Configure config/database.yml
```cp config/database.yml.example config/database.yml && $EDITOR config/database.yml```
1. Setup environment  
```bin/rails db:environments:set RAILS_ENV=development && bin/rails db:environments:set RAILS_ENV=test```
1. [Setup database](http://edgeguides.rubyonrails.org/configuring.html#configuring-a-database) & create databases  
```bundle exec rake db:setup && RAILS_ENV=test bundle exec rake db:setup```
1. Run tests to see if everything is working  
```bundle exec rspec && yarn test```
1. Install invoker (you will be asked for your computer password)
```gem install invoker && sudo invoker setup --tld localhost```  
1. Generate localhost certificates and install them
```dev/create-certificate```
1. Add the certificate to you Keychain (Chrome/Safari)  
![Install Root Certificate](images/install_certificate_osx.gif)
1. Start dev server  
```dev/start```
1. Open your browser  
[https://teach.appcamps.localhost]
