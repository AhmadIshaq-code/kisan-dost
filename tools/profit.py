from agents import function_tool, RunContextWrapper

from models.farmer import FarmerProfile
from models.profit import ProfitEstimate


# Controlled demo crop economics dataset
CROP_ECONOMICS = {
    "chickpea": {
        "yield_per_acre": 20,
        "price_per_unit": 7500,
        "cost_per_acre": 70000,
        "unit": "maund",
    },
    "wheat": {
        "yield_per_acre": 35,
        "price_per_unit": 3200,
        "cost_per_acre": 65000,
        "unit": "maund",
    },
    "maize": {
        "yield_per_acre": 40,
        "price_per_unit": 2800,
        "cost_per_acre": 70000,
        "unit": "maund",
    },
}


@function_tool
def profit_estimator(
    ctx: RunContextWrapper[FarmerProfile],
    crop_name: str,
) -> ProfitEstimate:
    """
    Calculate crop revenue, total cost, net profit,
    and break-even yield.

    Acreage comes from the farmer's context.
    Crop yield, price and cost come from the
    controlled Kisan Dost dataset.

    The LLM must not provide or invent these numbers.
    """

    farmer = ctx.context

    # -----------------------------
    # Validate farmer context
    # -----------------------------

    if farmer.acres <= 0:
        raise ValueError(
            "Farmer acreage must be greater than 0."
        )

    # -----------------------------
    # Validate crop name
    # -----------------------------

    if not crop_name.strip():
        raise ValueError(
            "Crop name is required."
        )

    crop_name = crop_name.strip().lower()

    # -----------------------------
    # Find controlled crop data
    # -----------------------------

    if crop_name not in CROP_ECONOMICS:
        available_crops = ", ".join(
            CROP_ECONOMICS.keys()
        )

        raise ValueError(
            f"No controlled economic data found for "
            f"'{crop_name}'. Available crops: "
            f"{available_crops}"
        )

    data = CROP_ECONOMICS[crop_name]

    expected_yield_per_acre = data["yield_per_acre"]
    expected_price_per_unit = data["price_per_unit"]
    cost_per_acre = data["cost_per_acre"]

    # -----------------------------
    # Deterministic calculations
    # -----------------------------

    total_revenue = (
        farmer.acres
        * expected_yield_per_acre
        * expected_price_per_unit
    )

    total_cost = (
        farmer.acres
        * cost_per_acre
    )

    net_profit = (
        total_revenue
        - total_cost
    )

    break_even_yield = (
        cost_per_acre
        / expected_price_per_unit
    )

    # -----------------------------
    # Return structured result
    # -----------------------------

    return ProfitEstimate(
        crop_name=crop_name.title(),
        total_revenue=round(total_revenue, 2),
        total_cost=round(total_cost, 2),
        net_profit=round(net_profit, 2),
        break_even_yield=round(
            break_even_yield,
            2,
        ),
    )
