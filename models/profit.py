from pydantic import BaseModel


class ProfitEstimate(BaseModel):
    crop_name: str
    total_revenue: float
    total_cost: float
    net_profit: float
    break_even_yield: float