import asyncio
import logging
import sys
import time

import os
from dotenv import load_dotenv

# Load environment variables from .env file immediately
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from agents import Runner, SQLiteSession
from agents.exceptions import (
    InputGuardrailTripwireTriggered,
    OutputGuardrailTripwireTriggered,
)

from models.farmer import FarmerProfile
from app_agents.triage import triage_agent

# Silence non-fatal OpenAI Agents SDK trace export warning
logging.getLogger("agents.tracing.processors").setLevel(logging.ERROR)

# Ensure proper Unicode / UTF-8 encoding on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


async def main():

    farmer = FarmerProfile(
        name="Ahmad",
        district="Faisalabad",
        province="Punjab",
        acres=5,
        soil_type="loamy",
        season="Rabi",
        water_availability="limited",
    )

    # Conversation memory - fresh session per program run
    session_id = f"kisan_session_{int(time.time())}"
    session = SQLiteSession(
        session_id,
        "kisan_dost_test.db",
    )

    while True:
        try:
            user_input = input("\n👨‍🌾 Farmer: ")
        except (EOFError, KeyboardInterrupt):
            print("\n👋 Kisan Dost band ho raha hai.")
            break

        if not user_input.strip():
            continue

        if user_input.lower() in {"exit", "quit"}:
            print("\n👋 Kisan Dost band ho raha hai.")
            break

        try:
            result = await Runner.run(
                triage_agent,
                user_input,
                context=farmer,
                session=session,
            )
            print(f"\n🤖 Kisan Dost: {result.final_output}")
        except InputGuardrailTripwireTriggered:
            print(
                "\n🤖 Kisan Dost: Main sirf kheti baari, faslon, mausam, khad, aur ziraat se mutaliq sawalat mein madad kar sakta hoon. Barah-e-karam ziraat se mutaliq sawal pochain."
            )
        except OutputGuardrailTripwireTriggered:
            print(
                "\n🤖 Kisan Dost: Kisan Dost safety policy ke mutabiq yeh maloomat verify nahi ki ja sakeen. Barah-e-karam kisi certified agriculture officer ya product label se ruju karein."
            )
        except Exception as e:
            print(f"\n⚠️ Kisan Dost error: {e}")


if __name__ == "__main__":
    asyncio.run(main())