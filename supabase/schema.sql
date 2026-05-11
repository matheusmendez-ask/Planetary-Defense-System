-- =============================================================================
-- Planetary Defense System — Supabase Schema
-- Fase 1: Arquitetura de Dados
-- =============================================================================
-- Execute este script no SQL Editor do Supabase (Dashboard → SQL Editor → New query)
-- =============================================================================

-- Habilita extensão para geração de UUID (Supabase já vem com pgcrypto habilitado,
-- mas garantimos aqui para portabilidade).
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tabela: asteroids
-- -----------------------------------------------------------------------------
-- Armazena os Near-Earth Objects (NEOs) extraídos da NASA NeoWs API,
-- enriquecidos com relatórios de ameaça gerados por LLM.
-- -----------------------------------------------------------------------------
create table if not exists public.asteroids (
    id                              uuid            primary key default gen_random_uuid(),
    nasa_neo_reference_id           text            not null unique,
    name                            text            not null,
    estimated_diameter_max_meters   double precision,
    is_potentially_hazardous        boolean         not null default false,
    close_approach_date             date,
    relative_velocity_km_h          double precision,
    miss_distance_km                double precision,
    ai_threat_report                text,
    created_at                      timestamptz     not null default now()
);

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------
-- Acelera filtros frequentes do dashboard (lista de ameaças, ordenação por data).
create index if not exists idx_asteroids_hazardous
    on public.asteroids (is_potentially_hazardous)
    where is_potentially_hazardous = true;

create index if not exists idx_asteroids_close_approach_date
    on public.asteroids (close_approach_date desc);

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- -----------------------------------------------------------------------------
-- Habilita RLS e permite SELECT público (dashboard usa anon key).
-- INSERT/UPDATE devem ser feitos via service_role key (script ETL).
alter table public.asteroids enable row level security;

drop policy if exists "asteroids_public_read" on public.asteroids;
create policy "asteroids_public_read"
    on public.asteroids
    for select
    to anon, authenticated
    using (true);

-- =============================================================================
-- Fim do schema
-- =============================================================================
