import logging
import os
import sys
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file immediately
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents import Runner, SQLiteSession
from agents.exceptions import (
    InputGuardrailTripwireTriggered,
    OutputGuardrailTripwireTriggered,
)
from models.farmer import FarmerProfile
from app_agents.triage import triage_agent

# Silence non-fatal OpenAI Agents SDK trace export warning
logging.getLogger("agents.tracing.processors").setLevel(logging.ERROR)
logger = logging.getLogger("kisan_dost_api")

app = FastAPI(
    title="Kisan Dost API",
    description="Thin API bridge connecting React frontend with Kisan Dost Agentic AI",
    version="1.0.0",
)

# Configure CORS strictly for the local React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "kisan_dost_test.db")


class FarmerInput(BaseModel):
    name: str | None = "Ahmad"
    district: str | None = None
    location: str | None = None
    province: str = "Punjab"
    acres: float | None = None
    farmSizeAcres: float | None = None
    soil_type: str | None = None
    soilType: str | None = None
    season: str = "Rabi"
    water_availability: str | None = None
    waterAvailability: str | None = None

    def to_farmer_profile(self) -> FarmerProfile:
        district_val = self.district or self.location or "Faisalabad"
        acres_val = self.acres if self.acres is not None else (self.farmSizeAcres if self.farmSizeAcres is not None else 5.0)
        soil_val = self.soil_type or self.soilType or "loamy"
        season_val = self.season or "Rabi"
        water_val = self.water_availability or self.waterAvailability or "limited"

        return FarmerProfile(
            name=self.name or "Ahmad",
            district=district_val,
            province=self.province or "Punjab",
            acres=float(acres_val),
            soil_type=soil_val,
            season=season_val,
            water_availability=water_val,
        )


class ChatRequest(BaseModel):
    message: str
    farmer: FarmerInput | None = None
    session_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Kisan Dost API"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    user_message = payload.message.strip() if payload.message else ""
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Resolve session ID to maintain conversation memory across requests
    session_id = payload.session_id.strip() if payload.session_id else f"kisan_web_{uuid.uuid4().hex[:12]}"
    session = SQLiteSession(session_id, DB_PATH)

    # Resolve farmer profile
    if payload.farmer:
        farmer_profile = payload.farmer.to_farmer_profile()
    else:
        farmer_profile = FarmerProfile(
            name="Ahmad",
            district="Faisalabad",
            province="Punjab",
            acres=5.0,
            soil_type="loamy",
            season="Rabi",
            water_availability="limited",
        )

    try:
        result = await Runner.run(
            triage_agent,
            user_message,
            context=farmer_profile,
            session=session,
        )
        return ChatResponse(response=result.final_output, session_id=session_id)

    except InputGuardrailTripwireTriggered:
        return ChatResponse(
            response="Main sirf kheti baari, faslon, mausam, khad, aur ziraat se mutaliq sawalat mein madad kar sakta hoon. Barah-e-karam ziraat se mutaliq sawal pochain.",
            session_id=session_id,
        )

    except OutputGuardrailTripwireTriggered:
        return ChatResponse(
            response="Kisan Dost safety policy ke mutabiq yeh maloomat verify nahi ki ja sakeen. Barah-e-karam kisi certified agriculture officer ya product label se ruju karein.",
            session_id=session_id,
        )

    except Exception as e:
        logger.error(f"Error during agent execution: {e}", exc_info=True)
        # Avoid exposing API keys or internals in client error messages
        raise HTTPException(
            status_code=500,
            detail="Kisan Dost service is temporarily unavailable. Please try again.",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
