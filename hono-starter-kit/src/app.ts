import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from '@hono/node-server'

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
  }),
);

app.get("/session", async (c) => {
  const { returnUrl, cancelUrl } = c.req.query();
  try {
    const response = await fetch(
      `${process.env.WINK_IDENTITY_BASE_URL}/wink/v1/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${process.env.WINK_IDENTITY_CLIENT_ID}:${process.env.WINK_IDENTITY_SECRET}`)}`,
          Cookie:
            "ApplicationGatewayAffinity=e2ffcfa875cf917a7f00d20a7284853d; ApplicationGatewayAffinityCORS=e2ffcfa875cf917a7f00d20a7284853d",
        },
        body: JSON.stringify({
          returnUrl,
          cancelUrl,
        }),
      },
    );

    if (!response.ok) {
      return c.json({ error: `HTTP error! status: ${response.status}` });
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json(error);
  }
});

app.get("/user", async (c) => {
  try {
    const { clientId, token } = c.req.query();
    const response = await fetch(
      `${process.env.WINK_IDENTITY_BASE_URL}/api/ConfidentialClient/verify-client`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ClientId: clientId,
          AccessToken: token,
          ClientSecret: `${process.env.WINK_IDENTITY_SECRET}`,
        }),
      },
    );

    if (!response.ok) {
      return c.json({ error: `HTTP error! status: ${response.status}` });
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json(error);
  }
});

app.get("/", (c) => c.text("Hello Developer!"));

serve({
  port: 8080,
  fetch: app.fetch,
});
