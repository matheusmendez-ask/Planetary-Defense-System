"""GenAI module: generates sarcastic threat reports for asteroids via Anthropic or OpenAI."""
from __future__ import annotations

import logging
import os
from typing import Literal

from transformer import AsteroidRecord

logger = logging.getLogger(__name__)

Provider = Literal["anthropic", "openai"]

SYSTEM_PROMPT = (
    "Você é um analista de defesa planetária que escreve relatórios de ameaça de asteroides "
    "em tom sarcástico, lúdico e levemente catastrofista, mas fiel aos dados fornecidos. "
    "Sempre responda em português brasileiro com exatamente 2 parágrafos, "
    "sem markdown, sem títulos, apenas texto corrido."
)

USER_PROMPT_TEMPLATE = (
    "Gere um Relatório de Ameaça (2 parágrafos) para o seguinte asteroide:\n\n"
    "- Nome: {name}\n"
    "- Diâmetro máximo estimado: {diameter} metros\n"
    "- Velocidade relativa: {velocity} km/h\n"
    "- Distância na maior aproximação: {miss_distance} km\n"
    "- Data da aproximação: {approach_date}\n"
    "- Classificado como potencialmente perigoso: {hazardous}\n\n"
    'Comece com algo como "A NASA diz que está tudo bem, mas..." e mantenha o tom ácido.'
)


def generate_threat_report(
    asteroid: AsteroidRecord,
    provider: Provider | None = None,
) -> str | None:
    """Generate a sarcastic threat report for the given asteroid.

    `provider` defaults to the `LLM_PROVIDER` env var. Returns `None` if the
    provider key is missing or the call fails — the pipeline continues without
    a report rather than aborting.
    """
    resolved_provider: str = provider or os.getenv("LLM_PROVIDER", "anthropic")
    user_prompt = _build_user_prompt(asteroid)

    try:
        if resolved_provider == "anthropic":
            return _call_anthropic(user_prompt)
        if resolved_provider == "openai":
            return _call_openai(user_prompt)
        logger.warning("Unknown LLM_PROVIDER=%r; skipping report.", resolved_provider)
        return None
    except Exception as e:  # noqa: BLE001 — pipeline must not abort on a single LLM failure
        logger.error("LLM call failed for %s: %s", asteroid["name"], e)
        return None


def _build_user_prompt(asteroid: AsteroidRecord) -> str:
    return USER_PROMPT_TEMPLATE.format(
        name=asteroid["name"],
        diameter=_fmt(asteroid["estimated_diameter_max_meters"]),
        velocity=_fmt(asteroid["relative_velocity_km_h"]),
        miss_distance=_fmt(asteroid["miss_distance_km"]),
        approach_date=asteroid["close_approach_date"] or "desconhecida",
        hazardous="sim" if asteroid["is_potentially_hazardous"] else "não",
    )


def _call_anthropic(user_prompt: str) -> str | None:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.warning("ANTHROPIC_API_KEY not set; skipping report.")
        return None

    from anthropic import Anthropic

    client = Anthropic(api_key=api_key)
    model = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")
    message = client.messages.create(
        model=model,
        max_tokens=600,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return "".join(block.text for block in message.content if block.type == "text").strip()


def _call_openai(user_prompt: str) -> str | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY not set; skipping report.")
        return None

    from openai import OpenAI

    client = OpenAI(api_key=api_key)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    response = client.chat.completions.create(
        model=model,
        max_tokens=600,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )
    return (response.choices[0].message.content or "").strip()


def _fmt(value: float | None) -> str:
    if value is None:
        return "desconhecido"
    return f"{value:,.2f}"
