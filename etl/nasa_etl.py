"""
Planetary Defense System — NASA ETL Pipeline (Fase 2)

Extrai NEOs do dia atual da NASA NeoWs, enriquece com relatórios de ameaça via
LLM (Anthropic ou OpenAI) e faz upsert no Supabase.

Execução:
    python nasa_etl.py
"""
from __future__ import annotations

import logging
import os
import sys
from datetime import date

from dotenv import load_dotenv

from ai_agent import generate_threat_report
from db import get_supabase_client, upsert_asteroids
from nasa_client import fetch_neos_for_date
from transformer import AsteroidRecord, transform_neos

logger = logging.getLogger("nasa_etl")


def configure_logging() -> None:
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO"),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def select_for_enrichment(
    asteroids: list[AsteroidRecord], top_n_fallback: int = 3
) -> list[AsteroidRecord]:
    """Pick which asteroids deserve an AI threat report.

    Strategy: all hazardous ones; if there are no hazardous, fall back to the
    top N largest by diameter. Keeps LLM cost bounded without missing the
    interesting cases.
    """
    hazardous = [a for a in asteroids if a["is_potentially_hazardous"]]
    if hazardous:
        return hazardous
    logger.info("No hazardous asteroids; falling back to top %d largest.", top_n_fallback)
    return sorted(
        asteroids,
        key=lambda a: a["estimated_diameter_max_meters"] or 0.0,
        reverse=True,
    )[:top_n_fallback]


def main() -> int:
    load_dotenv()
    configure_logging()

    nasa_api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
    today = date.today()

    try:
        raw_neos = fetch_neos_for_date(today, nasa_api_key)
    except Exception as e:  # noqa: BLE001
        logger.error("Failed to fetch NEOs from NASA: %s", e)
        return 1

    asteroids = transform_neos(raw_neos)
    logger.info("Transformed %d asteroids.", len(asteroids))

    if not asteroids:
        logger.warning("No asteroids to process today. Exiting.")
        return 0

    enrichment_targets = select_for_enrichment(asteroids)
    logger.info("Generating threat reports for %d asteroids...", len(enrichment_targets))

    reports_by_id: dict[str, str] = {}
    for asteroid in enrichment_targets:
        report = generate_threat_report(asteroid)
        if report:
            reports_by_id[asteroid["nasa_neo_reference_id"]] = report
            logger.info("Threat report generated for %s.", asteroid["name"])

    rows: list[dict[str, object]] = [
        {**a, "ai_threat_report": reports_by_id.get(a["nasa_neo_reference_id"])}
        for a in asteroids
    ]

    try:
        client = get_supabase_client()
        upsert_asteroids(client, rows)
    except KeyError as e:
        logger.error("Missing Supabase env var: %s", e)
        return 1
    except Exception as e:  # noqa: BLE001
        logger.error("Failed to upsert into Supabase: %s", e)
        return 1

    logger.info("ETL pipeline completed successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
