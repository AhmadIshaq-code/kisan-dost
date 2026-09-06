import httpx

from agents import function_tool


@function_tool
async def get_weather(
    latitude: float,
    longitude: float,
) -> dict:
    """
    Get current weather and short forecast using Open-Meteo.
    No API key is required.
    """

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "precipitation",
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
        ],
        "forecast_days": 3,
        "timezone": "auto",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()

    data = response.json()

    return {
        "current": data.get("current", {}),
        "daily": data.get("daily", {}),
    }