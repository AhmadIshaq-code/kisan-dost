from pydantic import BaseModel


class FarmerProfile(BaseModel):
    name: str | None = None
    district: str
    province: str = "Punjab"
    acres: float
    soil_type: str
    season: str
    water_availability: str

    last_selected_crop: str | None = None