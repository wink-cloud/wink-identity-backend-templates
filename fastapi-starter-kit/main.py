import os
import base64
import httpx

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = os.getenv("WINK_IDENTITY_BASE_URL")
CLIENT_ID = os.getenv("WINK_IDENTITY_CLIENT_ID")
SECRET = os.getenv("WINK_IDENTITY_SECRET")


@app.get("/")
async def root():
    return {"message": "Hello Developer!"}


# -----------------------------
# SESSION API
# -----------------------------
@app.get("/session")
async def create_session(
    returnUrl: str = Query(...),
    cancelUrl: str = Query(...),
):
    try:
        auth_string = f"{CLIENT_ID}:{SECRET}"
        auth_base64 = base64.b64encode(auth_string.encode()).decode()

        url = f"{BASE_URL}/wink/v1/session"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Basic {auth_base64}",
                },
                json={
                    "returnUrl": returnUrl,
                    "cancelUrl": cancelUrl,
                },
            )

        if response.status_code != 200:
            return {
                "error": f"HTTP error! status: {response.status_code}"
            }

        return response.json()

    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# USER VERIFY API
# -----------------------------
@app.get("/user")
async def verify_user(
    clientId: str = Query(...),
    token: str = Query(...),
):
    try:
        url = f"{BASE_URL}/api/ConfidentialClient/verify-client"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={"Content-Type": "application/json"},
                json={
                    "ClientId": clientId,
                    "AccessToken": token,
                    "ClientSecret": SECRET,
                },
            )

        if response.status_code != 200:
            return {
                "error": f"HTTP error! status: {response.status_code}"
            }

        return response.json()

    except Exception as e:
        return {"error": str(e)}
