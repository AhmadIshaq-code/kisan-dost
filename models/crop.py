from pydantic import BaseModel


class CropRecommendation(BaseModel):
    crop_name: str
    reason: str

    expected_yield_per_acre: float
    yield_unit: str

    expected_price_per_unit: float
    price_unit: str

    estimated_revenue_per_acre: float
    estimated_cost_per_acre: float
    estimated_profit_per_acre: float

    water_need: str
    data_source: str