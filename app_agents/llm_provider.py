import os
from dotenv import load_dotenv
from agents import AsyncOpenAI, OpenAIChatCompletionsModel

load_dotenv()


def get_agent_model() -> OpenAIChatCompletionsModel:
    """
    Returns an OpenAIChatCompletionsModel configured for either
    Google Gemini (OpenAI-compatible endpoint) or Groq based on
    environment variables.
    """
    provider = os.getenv("LLM_PROVIDER", "").strip().lower()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    groq_key = os.getenv("GROQ_API_KEY", "").strip()

    # Prefer Gemini if explicitly requested or if GEMINI_API_KEY is available and provider is not set to groq
    if provider == "gemini" or (not provider and gemini_key and provider != "groq"):
        gemini_client = AsyncOpenAI(
            api_key=gemini_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        )
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        return OpenAIChatCompletionsModel(
            model=model_name,
            openai_client=gemini_client,
        )
    else:
        groq_client = AsyncOpenAI(
            api_key=groq_key,
            base_url="https://api.groq.com/openai/v1",
        )
        model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
        return OpenAIChatCompletionsModel(
            model=model_name,
            openai_client=groq_client,
        )
