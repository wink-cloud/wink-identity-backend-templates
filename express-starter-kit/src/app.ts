import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello Developer!");
});

app.get("/session", async (req, res) => {
  const { returnUrl, cancelUrl } = req.query;

  try {
    const baseUrl = process.env.WINK_IDENTITY_BASE_URL;
    const clientId = process.env.WINK_IDENTITY_CLIENT_ID;
    const secret = process.env.WINK_IDENTITY_SECRET;

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const response = await fetch(`${baseUrl}/wink/v1/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        returnUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/user", async (req, res) => {
  const { clientId, token } = req.query;

  try {
    const baseUrl = process.env.WINK_IDENTITY_BASE_URL;
    const secret = process.env.WINK_IDENTITY_SECRET;

    const response = await fetch(
      `${baseUrl}/api/ConfidentialClient/verify-client`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ClientId: clientId,
          AccessToken: token,
          ClientSecret: secret,
        }),
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
