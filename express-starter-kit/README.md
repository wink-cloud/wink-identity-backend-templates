# Express Starter Kit (Wink Identity Backend)

Backend service that proxies **session creation** and **user verify**.

## Endpoints

| Method | Path | Query params | Description |
|--------|------|--------------|-------------|
| GET | `/session` | `returnUrl`, `cancelUrl` | Creates a Wink session (proxies `POST /wink/v1/session`). |
| GET | `/user` | `clientId`, `token` | Returns user profile (proxies `POST /api/ConfidentialClient/verify-client`). |

## Setup

1. Copy env example and set your Wink credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
WINK_IDENTITY_BASE_URL=https://stagelogin-api.winkapis.com
WINK_IDENTITY_CLIENT_ID=your_client_id
WINK_IDENTITY_SECRET=your_client_secret
```

2. Install and run:

```bash
pnpm install
pnpm dev
```

Server runs on port **8080** by default. Set `PORT` in `.env.local` to change it. (npm/yarn work too.)

## Usage from the frontend

- **Session:** `GET http://localhost:8080/session?returnUrl=<encodedReturnUrl>&cancelUrl=<encodedCancelUrl>`
- **User:** `GET http://localhost:8080/user?clientId=<clientId>&token=<accessOrIdToken>`

Use the same origin (or configure CORS) when calling from your React app.

## Before going live

- Set `WINK_IDENTITY_BASE_URL` (and credentials) to your **production** Wink API.
- Restrict CORS (`origin`) to your frontend origin instead of `"*"`.
- Use a process manager (e.g. systemd, PM2) and run behind HTTPS in production.
