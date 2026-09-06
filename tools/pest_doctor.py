import json
from pathlib import Path

from agents import function_tool
from models.pest import PestDiagnosis


DATA_FILE = Path(__file__).parent.parent / "data" / "pesticides.json"


def load_pesticide_data() -> list[dict]:
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


@function_tool
def pest_disease_doctor(
    crop: str,
    symptoms: str,
) -> PestDiagnosis:
    """
    Identify a likely agricultural pest or disease from the
    provided crop and symptoms, and return treatment information
    only from the controlled pesticide dataset.
    """

    if not crop.strip():
        raise ValueError("Crop is required.")

    if not symptoms.strip():
        raise ValueError("Symptoms are required.")

    crop = crop.strip().lower()
    symptoms_lower = symptoms.lower()

    data = load_pesticide_data()

    # Simple controlled matching for our initial version.
    for item in data:
        if item["crop"].lower() == crop:
            if item["pest"].lower() in symptoms_lower:
                return PestDiagnosis(
                    likely_pest_or_disease=item["pest"],
                    symptoms=[symptoms],
                    treatment=item["treatment"],
                    safety_notes=item["safety_notes"],
                )

    return PestDiagnosis(
        likely_pest_or_disease="Unknown",
        symptoms=[symptoms],
        treatment=(
            "No verified treatment was found in the controlled dataset. "
            "Consult a qualified local agriculture officer."
        ),
        safety_notes=(
            "Do not apply a pesticide or invent a dosage without "
            "verified product-label or agricultural-department guidance."
        ),
    )