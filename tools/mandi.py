import json
from pathlib import Path

from agents import function_tool
from models.market import MarketPrice


DATA_FILE = Path(__file__).parent.parent / "data" / "mandi_prices.json"


def load_mandi_data() -> list[dict]:
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


@function_tool
def mandi_price_lookup(
    crop_name: str,
    mandi_name: str,
) -> MarketPrice:
    """
    Look up a crop's mandi price from the controlled mandi dataset.
    """

    if not crop_name.strip():
        raise ValueError("Crop name is required.")

    if not mandi_name.strip():
        raise ValueError("Mandi name is required.")

    crop_name = crop_name.strip().lower()
    mandi_name = mandi_name.strip().lower()

    data = load_mandi_data()

    for item in data:
        if (
            item["crop"].lower() == crop_name
            and item["mandi"].lower() == mandi_name
        ):
            return MarketPrice(
                crop_name=item["crop"],
                mandi_name=item["mandi"],
                price_per_unit=item["price"],
                unit=item["unit"],
                source="Controlled demo dataset",
            )

    raise ValueError(
        f"No mandi price found for {crop_name} in {mandi_name}."
    )