# Wink Identity Backend Templates

Backend implementation examples for integrating **Wink Identity** using multiple server frameworks.

This repository provides starter templates that demonstrate how to:

* Create Wink Identity sessions
* Verify authenticated users
* Handle redirects
* Structure backend integrations

The goal is to help developers quickly plug Wink Identity into their backend stack of choice.

---

# 📦 Available Templates

| Framework  | Runtime     | Folder                 |
| ---------- | ----------- | ---------------------- |
| Hono       | Node.js     | `/hono-starter-kit`    |
| Express.js | Node.js     | `/express-starter-kit` |
| FastAPI    | Python (uv) | `/fastapi-starter-kit` |

More frameworks will be added soon.

---

# ⚙️ Environment Variables

Create a `.env` file in your project root:

```env
WINK_IDENTITY_BASE_URL=__base_url__
WINK_IDENTITY_CLIENT_ID=__client_id__
WINK_IDENTITY_SECRET=__client_secret__
```

Example:

```env
WINK_IDENTITY_BASE_URL=https://api.winkidentity.com
WINK_IDENTITY_CLIENT_ID=abc123
WINK_IDENTITY_SECRET=secret123
```

---

# 🚀 Run Instructions

## Node.js Templates (Hono / Express)

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Server runs on:

```
http://localhost:8080
```

These templates use **tsx** for TypeScript execution.

---

## FastAPI Template (Python + uv)

Install dependencies:

```bash
uv sync
```

Run server:

```bash
uv run uvicorn main:app --reload --port 8080
```

---

# 🔗 API Endpoints

## 1️⃣ Create Session

Initiates a Wink Identity authentication session.

### Request

```
GET /session
```

Example:

```
http://localhost:8080/session?returnUrl=__url__&cancelUrl=__url__
```

### Query Params

| Param       | Required | Description                  |
| ----------- | -------- | ---------------------------- |
| `returnUrl` | ✅        | Redirect URL after success   |
| `cancelUrl` | ✅        | Redirect URL if user cancels |

### What happens

Backend calls:

```
POST {BASE_URL}/wink/v1/session
```

Using:

* Basic Auth (Client ID + Secret)
* JSON body with redirect URLs

---

## 2️⃣ Verify User

Validates the authenticated user token.

### Request

```
GET /user
```

Example:

```
http://localhost:8080/user?clientId=__client_id__&token=__token__
```

### Query Params

| Param      | Required | Description                       |
| ---------- | -------- | --------------------------------- |
| `clientId` | ✅        | Your Wink client ID               |
| `token`    | ✅        | Access token received after login |

### What happens

Backend calls:

```
POST {BASE_URL}/api/ConfidentialClient/verify-client
```

Body:

```json
{
  "ClientId": "clientId",
  "AccessToken": "token",
  "ClientSecret": "secret"
}
```

---

# 🧠 How It Works (Flow)

1. Client calls `/session`
2. Backend creates Wink session
3. User completes authentication
4. Wink redirects to `returnUrl`
5. Frontend sends token to `/user`
6. Backend verifies user identity

---

# 🛠 Tech Stack Used

* Node.js
* Hono
* Express.js
* FastAPI
* httpx / fetch
* TypeScript
* Python
* uv (Astral)

---

# 📁 Suggested Folder Structure

```
wink-identity-backend-templates/
│
├── hono-starter-kit/
├── express-starter-kit/
├── fastapi-starter-kit/
│
└── README.md
```

---

# 🔐 Security Notes

* Never expose `CLIENT_SECRET` on frontend
* Always call Wink APIs from backend
* Use HTTPS in production
* Restrict CORS origins in prod

---

# 🧪 Testing Locally

You can test endpoints using:

* Browser
* Postman
* cURL

Example:

```bash
curl "http://localhost:8080/session?returnUrl=https://example.com&cancelUrl=https://example.com"
```

---

# 🤝 Contributing

Contributions are welcome!

You can:

* Add new backend frameworks
* Improve security handling
* Add Docker support
* Enhance error handling
* Update README docs

If you have suggestions, feel free to add them to the README or open a PR.

---

# 📌 Roadmap

Planned additions:

* NestJS template
* Spring Boot template
* .NET template
* Go Fiber template
* Dockerized setups
* Production deployment guides

---

# 📄 License

MIT License — free to use in commercial and personal projects.

---

**Built to make Wink Identity integrations faster ⚡**
