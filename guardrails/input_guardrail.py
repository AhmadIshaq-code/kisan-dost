
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
    # OpenAI Agents SDK may provide input as a list of messages.
    if isinstance(message, list):
        parts = []

        for item in message:
            if isinstance(item, dict):
                content = item.get("content", "")

                if isinstance(content, str):
                    parts.append(content)

                elif isinstance(content, list):
                    for content_item in content:
                        if isinstance(content_item, dict):
                            text = content_item.get("text", "")
                            if isinstance(text, str):
                                parts.append(text)

            elif isinstance(item, str):
                parts.append(item)

        text = " ".join(parts).lower().strip()

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
