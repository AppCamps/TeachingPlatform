### Deployment
1. [Install Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-command-line)
2. Login to heroku
```heroku login```
3. Add (or rename) heroku git origin(s)
```
# View existing remotes
git remote -v
# Add heroku remotes
heroku git:remote -a {{HEROKU_STAGING_APP_NAME}} -r staging
heroku git:remote -a {{HEROKU_PRODUCTION_APP_NAME}} -r production
# Rename heroku remotes (pay attention which heroku app you are using and rename accordingly!
git remote rename {previous name - probably heroku} {staging|production}
```
4. Use provided script to deploy to heroku
```
# without migrations
./scripts/deploy {staging|production} no-migrations
# with migrations
./scripts/deploy {staging|production}
```
