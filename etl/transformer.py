"""Transform raw NASA NEO records into the `asteroids` schema."""
from __future__ import annotations

import logging
from typing import Any, TypedDict

logger = logging.getLogger(__name__)


class AsteroidRecord(TypedDict):
    nasa_neo_reference_id: str
    name: str
    estimated_diameter_max_meters: float | None
    is_potentially_hazardous: bool
    close_approach_date: str | None
    relative_velocity_km_h: float | None
    miss_distance_km: float | None


def transform_neo(raw: dict[str, Any]) -> AsteroidRecord | None:
    """Map a single NASA NEO record to the asteroids schema.

    Returns `None` if essential fields are missing or malformed.
    """
    try:
        approach = (raw.get("close_approach_data") or [{}])[0]
        diameter = (
            raw.get("estimated_diameter", {})
            .get("meters", {})
            .get("estimated_diameter_max")
        )
        return AsteroidRecord(
            nasa_neo_reference_id=str(raw["neo_reference_id"]),
            name=raw["name"],
            estimated_diameter_max_meters=_to_float(diameter),
            is_potentially_hazardous=bool(raw.get("is_potentially_hazardous_asteroid", False)),
            close_approach_date=approach.get("close_approach_date"),
            relative_velocity_km_h=_to_float(
                approach.get("relative_velocity", {}).get("kilometers_per_hour")
            ),
            miss_distance_km=_to_float(
                approach.get("miss_distance", {}).get("kilometers")
            ),
        )
    except (KeyError, TypeError, IndexError) as e:
        logger.warning("Skipping malformed NEO record: %s", e)
        return None


def transform_neos(raw_neos: list[dict[str, Any]]) -> list[AsteroidRecord]:
    return [r for r in (transform_neo(neo) for neo in raw_neos) if r is not None]


def _to_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
