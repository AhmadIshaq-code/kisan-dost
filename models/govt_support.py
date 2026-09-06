from pydantic import BaseModel


class GovtSupport(BaseModel):
    program_name: str
    province: str
    support_type: str
    eligibility: str
    benefit: str
    verification_status: str