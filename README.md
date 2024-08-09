## Health Atlas Updated Analyses

This is the repository for the web app showing updated health atlas analyses.

The development version of the web app is continuously deployed from the main branch to Microsoft Azure, and the site can be found at http://utv-oppdaterte-analyser.azurewebsites.net.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Running Docker-version

You can also build a local docker-image of the web app.

```
docker build . -t oppdaterte-analyser/nextjs  
docker run -p 3000:3000 oppdaterte-analyser/nextjs 
```

