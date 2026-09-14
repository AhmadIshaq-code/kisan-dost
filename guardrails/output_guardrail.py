
from agents import (
    GuardrailFunctionOutput,
    RunContextWrapper,
    output_guardrail,
)

import re

# Dangerous / unsupported patterns that should never appear
# as confident advice in the final farmer response.

DANGEROUS_PATTERNS = [
    "take 100 ml",
    "take 200 ml",
    "take 500 ml",
    "apply 100 ml",
    "apply 200 ml",
    "apply 500 ml",
    "spray 100 ml",
    "spray 200 ml",
    "spray 500 ml",
    "dose 100",
    "dose 200",
    "dose 500",
]

# Unverified numerical pesticide dosage (e.g., "100 ml per acre", "250 ml/acre")
NUMERICAL_DOSAGE_REGEX = re.compile(
    r"\b\d+\s*(?:ml|mg|gm|litres?|liters?)\s*(?:/|\bper\b)\s*acre\b",
    re.IGNORECASE,
)

USD_CURRENCY_REGEX = re.compile(r"\$\s*\d+", re.IGNORECASE)

HUMAN_MEDICAL_PATTERNS = [
    "take this medicine",
    "take these tablets",
    "take this tablet",
    "human dosage",
    "medical dosage",
    "prescribe medicine",
]

def check_output_safety(output: str) -> tuple[bool, str]:
    text = output.lower()

    # 1. Block unverified pesticide dosage
    for pattern in DANGEROUS_PATTERNS:
        if pattern in text:
            return (
                False,
                "Final answer contains an unverified pesticide dosage."
            )

    if NUMERICAL_DOSAGE_REGEX.search(output):
        return (
            False,
            "Final answer contains an unverified pesticide dosage per acre."
        )

    # 2. Block human medical advice
    for pattern in HUMAN_MEDICAL_PATTERNS:
        if pattern in text:
            return (
                False,
                "Final answer contains human medical advice."
            )

    # 3. Currency consistency
    if "₹" in output or "inr" in text or "usd" in text or USD_CURRENCY_REGEX.search(output):
        return (
            False,
            "Final answer contains unsupported currency format."
        )

    # 4. Government support must not be presented
    # as guaranteed/confirmed when using demo data.
    government_claims = [
        "you are guaranteed",
        "guaranteed subsidy",
        "confirmed subsidy",
        "government will give you",
        "you will receive the subsidy",
    ]

    for pattern in government_claims:
        if pattern in text:
            return (
                False,
                "Final answer presents government support as guaranteed."
            )

    return True, "Output passed safety checks."


@output_guardrail
async def output_safety_guardrail(
    ctx: RunContextWrapper,
    agent,
    output: str,
) -> GuardrailFunctionOutput:

    is_safe, reason = check_output_safety(output)

    return GuardrailFunctionOutput(
        output_info={
            "is_safe": is_safe,
            "reason": reason,
        },
        tripwire_triggered=not is_safe,
    )
