"""NASA NeoWs (Near Earth Object Web Service) client."""
from __future__ import annotations

import logging
from datetime import date
from typing import Any

import requests

logger = logging.getLogger(__name__)

NEOWS_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed"


def fetch_neos_for_date(target_date: date, api_key: str, timeout: int = 30) -> list[dict[str, Any]]:
    """Fetch all Near-Earth Objects with close approach on `target_date`.

    Returns the raw NEO records exactly as the NASA API returns them.
    Raises `requests.HTTPError` on non-2xx responses.
    """
    params = {
        "start_date": target_date.isoformat(),
        "end_date": target_date.isoformat(),
        "api_key": api_key,
    }
    logger.info("Fetching NEOs for %s from NASA NeoWs...", target_date)
    response = requests.get(NEOWS_FEED_URL, params=params, timeout=timeout)
    response.raise_for_status()
    data = response.json()
    neos: list[dict[str, Any]] = data.get("near_earth_objects", {}).get(target_date.isoformat(), [])
    logger.info("Received %d NEOs for %s.", len(neos), target_date)
    return neos
