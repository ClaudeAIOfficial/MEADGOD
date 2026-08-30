# Ozzy interactive character site

A no-build static website centered around the character image.

## Run locally
Open `index.html` in a browser, or use any simple local server.

## Deploy
This folder can be dropped directly onto Vercel, Netlify, GitHub Pages, or any static host.

## Change the name
Open `script.js` and edit:

```js
name: "Ozzy"
```

## Connect a real AI brain later
Set `apiEndpoint` in `script.js` to your own server endpoint. The frontend sends:

```json
{ "message": "user message", "character": "Ozzy" }
```

Your endpoint should return:

```json
{ "reply": "character response" }
```

Until an endpoint is configured, the site uses the built-in local personality so the interaction works immediately.
