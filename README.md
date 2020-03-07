# Paulness.com - Personal Website / Blog

This is a personal website used showcasing anything new that I have come across that could be of interest to the tech community.

## Getting started

### .env file

This application depends on [Algolia](https://www.algolia.com/) for search functionality. Make sure you have an `.env` file with these variables inside. You get these from signing up for an account.

```text
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_ONLY_API_KEY=...
ALGOLIA_ADMIN_API_KEY=...
ALGOLIA_INDEX_NAME=...
```

### Local run instructions

This site was built using node:8 so all the npm commands inside of `docker run -p 8000:8000 -it --rm -v $(pwd):/wd node:8 bash`

```bash
cd /wd

# Install the modules defined in package-lock.json
npm i

# Build the static /public dir
npm run build

# Launch the application on localhost:8000
npm run develop-docker-host
```

### Local deploy instructions

The static site is deployed via GitHub pages, the master branch is essentially the /public directory. While the develop branch is used for local development.

`npm run deploy`

### Revert a broken deployment

Since this blog just uses master branch as the public directory for GitHub pages you can just revert master with git commands to the last commit.

```bash
git checkout master
git pull
git reset --hard HEAD~1
git push -f master:master
```