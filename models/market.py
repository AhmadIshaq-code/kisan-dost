from pydantic import BaseModel


class MarketPrice(BaseModel):
    crop_name: str
    mandi_name: str
    price_per_unit: float
    unit: str
    source: str