"""Supabase upsert helpers for the `asteroids` table."""
from __future__ import annotations

import logging
import os
from typing import Any

from supabase import Client, create_client

logger = logging.getLogger(__name__)


def get_supabase_client() -> Client:
    """Build a Supabase client from env vars.

    Uses the service_role key so the script can write. Raises `KeyError` if
    `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is not set.
    """
    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    return create_client(url, key)


def upsert_asteroids(client: Client, rows: list[dict[str, Any]]) -> int:
    """Upsert asteroid rows on `nasa_neo_reference_id`. Returns affected count."""
    if not rows:
        logger.info("No rows to upsert.")
        return 0
    logger.info("Upserting %d asteroids into Supabase...", len(rows))
    response = (
        client.table("asteroids")
        .upsert(rows, on_conflict="nasa_neo_reference_id")
        .execute()
    )
    count = len(response.data or [])
    logger.info("Upsert complete: %d rows affected.", count)
    return count
