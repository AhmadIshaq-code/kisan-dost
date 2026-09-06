from pydantic import BaseModel


class PestDiagnosis(BaseModel):
    likely_pest_or_disease: str
    symptoms: list[str]
    treatment: str
    safety_notes: str