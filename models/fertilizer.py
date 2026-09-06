from pydantic import BaseModel


class FertilizerPlan(BaseModel):
    fertilizer_name: str
    bags_per_acre: float
    total_bags: float
    price_per_bag: float
    total_cost: float