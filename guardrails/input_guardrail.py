
from agents import (
    GuardrailFunctionOutput,
    RunContextWrapper,
    input_guardrail,
)


AGRICULTURE_KEYWORDS = {
    "crop",
    "crops",
    "fasal",
    "farming",
    "farmer",
    "agriculture",
    "agricultural",
    "soil",
    "zameen",
    "khet",
    "fertilizer",
    "fertiliser",
    "urea",
    "dap",
    "npk",
    "pesticide",
    "pesticides",
    "spray",
    "pest",
    "disease",
    "symptom",
    "weather",
    "rain",
    "barish",
    "temperature",
    "irrigation",
    "pani",
    "water",
    "mandi",
    "price",
    "rate",
    "yield",
    "profit",
    "revenue",
    "cost",
    "subsidy",
    "subsidized",
    "subsidised",
    "kisan",
    "kisan card",
    "loan",
    "agriculture loan",
    "government support",
    "government scheme",
    "farming scheme",
    "rabi",
    "kharif",
    "wheat",
    "gehun",
    "maize",
    "corn",
    "chickpea",
    "chana",
    "cotton",
    "rice",
    "chaawal",
}



def is_agriculture_related(message) -> bool:
    # OpenAI Agents SDK may provide input as a list of messages from session history.
    # We must validate the latest user query, not the historical accumulated turns.
    if isinstance(message, list):
        target = ""
        for item in reversed(message):
            if isinstance(item, dict):
                role = item.get("role")
                if role == "user" or role is None:
                    content = item.get("content", "")
                    if isinstance(content, str):
                        target = content
                        break
                    elif isinstance(content, list):
                        target = " ".join(
                            c.get("text", "")
                            for c in content
                            if isinstance(c, dict)
                        )
                        break
            elif isinstance(item, str):
                target = item
                break
            elif hasattr(item, "content"):
                target = str(item.content)
                break
        text = target.lower().strip()
    else:
        text = str(message).lower().strip()

    if not text:
        return False

    return any(keyword in text for keyword in AGRICULTURE_KEYWORDS)



@input_guardrail
async def agriculture_input_guardrail(
    ctx: RunContextWrapper,
    agent,
    input: str,
) -> GuardrailFunctionOutput:

    allowed = is_agriculture_related(input)

    if allowed:
        reason = (
            "Input is related to agriculture or farming."
        )
    else:
        reason = (
            "Input is clearly unrelated to agriculture."
        )

    return GuardrailFunctionOutput(
        output_info={
            "is_agriculture_related": allowed,
            "reason": reason,
        },
        tripwire_triggered=not allowed,
    )
