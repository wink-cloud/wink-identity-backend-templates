import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

const getEnv = (key: string): string | undefined => process.env[key];

const requireEnv = (key: string): string => {
  const value = getEnv(key);
  if (!value?.trim()) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value.trim();
};

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello Developer!");
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get("/session", async (req: Request, res: Response) => {
  const { returnUrl, cancelUrl } = req.query;

  if (typeof returnUrl !== "string" || typeof cancelUrl !== "string") {
    return res.status(400).json({
      error: "Missing or invalid query params: returnUrl and cancelUrl are required.",
    });
  }

  try {
    const baseUrl = requireEnv("WINK_IDENTITY_BASE_URL");
    const clientId = requireEnv("WINK_IDENTITY_CLIENT_ID");
    const secret = requireEnv("WINK_IDENTITY_SECRET");

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const response = await fetch(`${baseUrl}/wink/v1/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ returnUrl, cancelUrl }),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Wink API error: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Session request failed.";
    if (message.startsWith("Missing required env")) {
      return res.status(503).json({ error: "Backend not configured. Set WINK_IDENTITY_* env vars." });
    }
    return res.status(500).json({ error: message });
  }
});

app.get("/user", async (req: Request, res: Response) => {
  const { clientId, token } = req.query;

  if (typeof clientId !== "string" || typeof token !== "string") {
    return res.status(400).json({
      error: "Missing or invalid query params: clientId and token are required.",
    });
  }

  try {
    const baseUrl = requireEnv("WINK_IDENTITY_BASE_URL");
    const secret = requireEnv("WINK_IDENTITY_SECRET");

    const response = await fetch(`${baseUrl}/api/ConfidentialClient/verify-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ClientId: clientId,
        AccessToken: token,
        ClientSecret: secret,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Wink API error: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "User request failed.";
    if (message.startsWith("Missing required env")) {
      return res.status(503).json({ error: "Backend not configured. Set WINK_IDENTITY_* env vars." });
    }
    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
