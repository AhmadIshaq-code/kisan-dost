import asyncio

from agents import Runner, SQLiteSession

from models.farmer import FarmerProfile
from app_agents.triage import triage_agent


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

    # Conversation memory
    session = SQLiteSession(
    "fresh_test_001",
    "kisan_dost_test.db",
    )

    while True:

        user_input = input("\n👨‍🌾 Farmer: ")

        if user_input.lower() in {"exit", "quit"}:
            print("\n👋 Kisan Dost band ho raha hai.")
            break

        result = await Runner.run(
            triage_agent,
            user_input,
            context=farmer,
            session=session,
        )

        print(f"\n🤖 Kisan Dost: {result.final_output}")


if __name__ == "__main__":
    asyncio.run(main())