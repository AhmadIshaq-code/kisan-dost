
from agents import (
    GuardrailFunctionOutput,
    RunContextWrapper,
    output_guardrail,
)

# Dangerous / unsupported patterns that should never appear
# as confident advice in the final farmer response.

DANGEROUS_PATTERNS = [
    "take 100 ml",
    "take 200 ml",
    "take 500 ml",
    "apply 100 ml",
    "apply 200 ml",
    "apply 500 ml",
    "dose 100",
    "dose 200",
    "dose 500",
    "ml per acre",
    "ml/acre",
    "mg per acre",
    "mg/acre",
]

UNSAFE_CURRENCY_PATTERNS = [
    "₹",
    "$",
]

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

    # 2. Block human medical advice
    for pattern in HUMAN_MEDICAL_PATTERNS:
        if pattern in text:
            return (
                False,
                "Final answer contains human medical advice."
            )

    # 3. Currency consistency
    for pattern in UNSAFE_CURRENCY_PATTERNS:
        if pattern in output:
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
