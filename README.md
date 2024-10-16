# Health Atlas Updated Analyses

This is the repository for the web app showing updated health atlas analyses.

The development version of the web app is continuously deployed from the main branch to Microsoft Azure, and the site can be found at http://web-oppdaterte-analyser.azurewebsites.net.

## MongoDB

The app uses MongoDB.

Remember to add an environment variable to a file `.env.local`, located locally in the project root directory. Add the environment variable MONGO_URI and the connection string.

(This file is not commited and pushed to GitHub.)

## Language redirects

To support internationalization (i8n), the pages are automatically redirected from the root `/` to `/no/`. This is done in middleware.tsx. To add exceptions to this rule, see the regex pattern in the middleware code.

## Running locally

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

You can build a local docker-image of the web app.

```
docker build . -t oppdaterte-analyser/nextjs
docker run -p 3000:3000 oppdaterte-analyser/nextjs
```
