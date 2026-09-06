
from agents import function_tool, RunContextWrapper

from models.farmer import FarmerProfile
from models.crop import CropRecommendation


@function_tool
def crop_advisor(
    ctx: RunContextWrapper[FarmerProfile],
    request: str,
) -> list[CropRecommendation]:
    """
    Recommend suitable crops using the farmer profile
    stored in the run context.

    The request parameter tells the tool what kind
    of crop recommendation the farmer wants.
    Farmer information comes from ctx.context.
    """

    farmer = ctx.context

    district = farmer.district.strip()
    soil_type = farmer.soil_type.strip()
    season = farmer.season.strip().lower()
    water_availability = farmer.water_availability.strip().lower()
    acres = farmer.acres

    # -------------------------
    # Validation
    # -------------------------

    if not request.strip():
        raise ValueError("Recommendation request is required.")

    if not district:
        raise ValueError("District is required.")

    if not soil_type:
        raise ValueError("Soil type is required.")

    if acres <= 0:
        raise ValueError("Acres must be greater than 0.")

    if season not in {"rabi", "kharif"}:
        raise ValueError("Season must be Rabi or Kharif.")

    # -------------------------
    # Crop recommendations
    # -------------------------

    recommendations = []

    if season == "rabi":

        # Limited water → Chickpea
        if water_availability == "limited":

            recommendations.append(
                CropRecommendation(
                    crop_name="Chickpea",
                    reason=(
                        f"Suitable for {district}, {soil_type} soil "
                        "and limited water during Rabi."
                    ),
                    expected_yield_per_acre=20,
                    yield_unit="maund",
                    expected_price_per_unit=7500,
                    price_unit="PKR/maund",
                    estimated_revenue_per_acre=150000,
                    estimated_cost_per_acre=70000,
                    estimated_profit_per_acre=80000,
                    water_need="Low",
                    data_source="Kisan Dost controlled dataset",
                )
            )

        # Wheat
        recommendations.append(
            CropRecommendation(
                crop_name="Wheat",
                reason=(
                    f"Common Rabi crop suitable for "
                    f"{district} and {soil_type} soil."
                ),
                expected_yield_per_acre=35,
                yield_unit="maund",
                expected_price_per_unit=3200,
                price_unit="PKR/maund",
                estimated_revenue_per_acre=112000,
                estimated_cost_per_acre=65000,
                estimated_profit_per_acre=47000,
                water_need="Medium",
                data_source="Kisan Dost controlled dataset",
            )
        )

    elif season == "kharif":

        recommendations.append(
            CropRecommendation(
                crop_name="Maize",
                reason=(
                    f"Suitable Kharif crop for "
                    f"{district} and {soil_type} soil."
                ),
                expected_yield_per_acre=40,
                yield_unit="maund",
                expected_price_per_unit=2800,
                price_unit="PKR/maund",
                estimated_revenue_per_acre=112000,
                estimated_cost_per_acre=70000,
                estimated_profit_per_acre=42000,
                water_need="Medium",
                data_source="Kisan Dost controlled dataset",
            )
        )
    if recommendations:
        farmer.last_selected_crop = recommendations[0].crop_name.lower()

    return recommendations
