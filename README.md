# Unsent

An anonymous unsent-messages platform for unspoken words, confessions, and closures.

## Run locally

**Prerequisite:** Node.js

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.

The frontend uses `/api/messages/` locally, with Vite proxying requests to the
production API. To use a different backend, set `VITE_API_BASE_URL` to its
messages API URL, including `/api/messages/`.

## API behavior

The Home and Bin searches require an exact recipient name (case-insensitive) and
show approved messages only. The frontend calls `GET /api/messages/search/` to
fetch approved messages, `GET /api/messages/search/?name=rejeena` to search by
recipient, and `POST /api/messages/create/` to submit a message. Pending messages
remain hidden until approved. The API returns recipient names as `recipient`;
the frontend normalizes that field to `recipient_name` for its message display
components.

## Production deployment

Build the static frontend with `npm run build` and deploy the generated `dist/`
directory to a static hosting provider. Configure the host to serve `index.html`
for application routes, and set `VITE_API_BASE_URL` in the build environment if
you need to override the production default. Because the browser calls the API
over HTTPS, configure the backend's CORS policy to allow the deployed frontend
origin. The Vite proxy is only used during local development and is not part of
the production build.
