
from agents import function_tool, RunContextWrapper

from models.farmer import FarmerProfile
from models.fertilizer import FertilizerPlan


UREA_N_PERCENT = 46
DAP_N_PERCENT = 18
DAP_P2O5_PERCENT = 46

UREA_BAG_KG = 50
DAP_BAG_KG = 50

UREA_PRICE = 5000
DAP_PRICE = 14000


# Controlled Kisan Dost fertilizer dataset.
# The LLM must NOT invent these values.
CROP_FERTILIZER_REQUIREMENTS = {
    "chickpea": {
        "nitrogen_kg_per_acre": 20,
        "phosphorus_kg_per_acre": 30,
    },
    "wheat": {
        "nitrogen_kg_per_acre": 60,
        "phosphorus_kg_per_acre": 30,
    },
    "maize": {
        "nitrogen_kg_per_acre": 80,
        "phosphorus_kg_per_acre": 40,
    },
}


@function_tool
def fertilizer_calculator(
    ctx: RunContextWrapper[FarmerProfile],
    crop_name: str,
) -> list[FertilizerPlan]:
    """
    Calculate approximate Urea and DAP requirements
    and cost for a crop.

    Acreage comes from the farmer's run context.

    Nitrogen and phosphorus requirements come from
    the controlled Kisan Dost dataset.

    The LLM provides only the crop name.
    """

    farmer = ctx.context

    # Validate acreage from farmer context
    if farmer.acres <= 0:
        raise ValueError(
            "Farmer acreage must be greater than 0."
        )

    # Validate crop name
    if not crop_name.strip():
        raise ValueError(
            "Crop name is required."
        )

    crop_name = crop_name.strip().lower()

    # Check controlled dataset
    if crop_name not in CROP_FERTILIZER_REQUIREMENTS:
        available_crops = ", ".join(
            CROP_FERTILIZER_REQUIREMENTS.keys()
        )

        raise ValueError(
            f"No controlled fertilizer data found for "
            f"'{crop_name}'. Available crops: "
            f"{available_crops}"
        )

    # Acreage comes from context
    acres = farmer.acres

    # Get controlled fertilizer requirements
    requirements = CROP_FERTILIZER_REQUIREMENTS[crop_name]

    nitrogen_kg_per_acre = requirements[
        "nitrogen_kg_per_acre"
    ]

    phosphorus_kg_per_acre = requirements[
        "phosphorus_kg_per_acre"
    ]

    # -----------------------------------------
    # DAP calculation
    # -----------------------------------------

    # DAP required to supply phosphorus (P2O5)
    dap_kg_per_acre = (
        phosphorus_kg_per_acre
        / (DAP_P2O5_PERCENT / 100)
    )

    # Nitrogen supplied by DAP
    nitrogen_from_dap = (
        dap_kg_per_acre
        * (DAP_N_PERCENT / 100)
    )

    # Remaining nitrogen comes from Urea
    remaining_nitrogen = max(
        nitrogen_kg_per_acre
        - nitrogen_from_dap,
        0,
    )

    # -----------------------------------------
    # Urea calculation
    # -----------------------------------------

    urea_kg_per_acre = (
        remaining_nitrogen
        / (UREA_N_PERCENT / 100)
    )

    # -----------------------------------------
    # Total quantity for farmer's land
    # -----------------------------------------

    total_dap_kg = (
        dap_kg_per_acre * acres
    )

    total_urea_kg = (
        urea_kg_per_acre * acres
    )

    # Convert kg → bags
    total_dap_bags = (
        total_dap_kg / DAP_BAG_KG
    )

    total_urea_bags = (
        total_urea_kg / UREA_BAG_KG
    )

    # -----------------------------------------
    # Cost calculation
    # -----------------------------------------

    total_dap_cost = (
        total_dap_bags * DAP_PRICE
    )

    total_urea_cost = (
        total_urea_bags * UREA_PRICE
    )

    # -----------------------------------------
    # Return structured result
    # -----------------------------------------

    return [
        FertilizerPlan(
            fertilizer_name="DAP",
            bags_per_acre=round(
                dap_kg_per_acre / DAP_BAG_KG,
                2,
            ),
            total_bags=round(
                total_dap_bags,
                2,
            ),
            price_per_bag=DAP_PRICE,
            total_cost=round(
                total_dap_cost,
                2,
            ),
        ),

        FertilizerPlan(
            fertilizer_name="Urea",
            bags_per_acre=round(
                urea_kg_per_acre / UREA_BAG_KG,
                2,
            ),
            total_bags=round(
                total_urea_bags,
                2,
            ),
            price_per_bag=UREA_PRICE,
            total_cost=round(
                total_urea_cost,
                2,
            ),
        ),
    ]
