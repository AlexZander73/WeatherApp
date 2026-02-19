# Weather Now

Fast, clean weather app using Open-Meteo with geolocation and city search.

## Features
- Use browser location or search a city (top 5 results)
- Current conditions, next 24 hours, next 7 days
- Loading + error states
- Caches last location in localStorage

## Tech
- Vite + TypeScript
- Open-Meteo Forecast API + Geocoding API

## Local dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (two options)

### Option A: GitHub Actions (recommended)
1. Push to `main`.
2. In your repo settings, go to Pages and set Source to "GitHub Actions".
3. The workflow in `.github/workflows/deploy.yml` will publish `dist`.

### Option B: gh-pages branch
1. Build the project:
```bash
npm install
npm run build
```
2. Push `dist` to a `gh-pages` branch:
```bash
git checkout --orphan gh-pages
rm -rf ./*
cp -r dist/* .
git add .
git commit -m "Deploy"
git push origin gh-pages
```
3. In repo settings, set Pages source to `gh-pages` branch.

## Data sources
Open-Meteo Forecast API and Geocoding API.
