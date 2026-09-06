
import json
from pathlib import Path

from agents import function_tool, RunContextWrapper

from models.farmer import FarmerProfile
from models.govt_support import GovtSupport


DATA_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "govt_support.json"
)


def load_govt_support_data() -> list[dict]:
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


@function_tool
def govt_support_finder(
    ctx: RunContextWrapper[FarmerProfile],
    support_need: str,
) -> list[GovtSupport]:
    """
    Find agricultural government support programs
    using the farmer's province from run context.

    The farmer's province is NOT provided by the LLM.
    It comes directly from FarmerProfile context.

    The support need is provided by the LLM.
    """

    farmer = ctx.context

    province = farmer.province.strip().lower()

    if not province:
        raise ValueError(
            "Farmer province is required."
        )

    if not support_need.strip():
        raise ValueError(
            "Support need is required."
        )

    support_need = support_need.strip().lower()

    data = load_govt_support_data()

    results = []

    for item in data:
        item_province = item["province"].strip().lower()

        if item_province != province:
            continue

        item_type = item["support_type"].strip().lower()
        item_benefit = item["benefit"].strip().lower()
        item_program = item["program_name"].strip().lower()

        if (
            support_need in item_type
            or support_need in item_benefit
            or support_need in item_program
        ):
            results.append(
                GovtSupport(
                    program_name=item["program_name"],
                    province=item["province"],
                    support_type=item["support_type"],
                    eligibility=item["eligibility"],
                    benefit=item["benefit"],
                    verification_status=item[
                        "verification_status"
                    ],
                )
            )

    return results