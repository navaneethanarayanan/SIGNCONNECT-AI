# SignConnect AI backend

This Node.js backend exposes:

- `GET /api/health`
- `POST /api/chat`

It keeps `OPENAI_API_KEY` on the server and proxies Jarvis chat requests to the OpenAI Responses API.

## Run locally

1. Copy `.env.example` to `.env`.
2. Add a real `OPENAI_API_KEY` to `.env`.
3. Run `npm run dev` from this directory.

The frontend development server proxies `/api` requests to `http://localhost:3001`.

The included login and OTP flow is still a frontend demo. A real login system requires a database, password hashing, and an email/SMS provider.
