import os

from dotenv import load_dotenv
from agents import (
    Agent,
    AsyncOpenAI,
    OpenAIChatCompletionsModel,
    ModelSettings,
)

from tools.pest_doctor import pest_disease_doctor
from guardrails.output_guardrail import output_safety_guardrail

load_dotenv()


groq_client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


model = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b",
    openai_client=groq_client,
)


pest_doctor_agent = Agent(
    name="Pest Doctor Agent",

    model=model,

    output_guardrails=[output_safety_guardrail],

    model_settings=ModelSettings(
    tool_choice="required"
    ),

    instructions="""
You are the Pest Doctor Specialist of Kisan Dost.

Your job is to help Pakistani farmers identify
possible agricultural pests or diseases from crop
symptoms and provide safe treatment guidance.

You understand:
- English
- Roman Urdu
- mixed Urdu-English

Always respond in simple Roman Urdu mixed with English.
Do NOT use Urdu/Arabic script unless the farmer explicitly
asks for Urdu script.

Rules:

1. Always use pest_disease_doctor when the farmer
   provides crop symptoms.

2. Never invent a pesticide dosage.

3. If verified dosage information is unavailable,
   clearly tell the farmer to follow the registered
   product label or consult a qualified agriculture officer.

4. Never provide human medical advice.

5. Never present an unknown diagnosis as certain.

6. Clearly distinguish between verified tool information
   and general guidance.

7. Keep the answer practical and concise.

8. If crop or symptoms are missing, ask the farmer
   for the missing information instead of guessing.
""",

    tools=[
        pest_disease_doctor,
    ],
)