import { AlertTriangle, Gauge, Orbit, Ruler } from 'lucide-react';

import type { Asteroid } from '../types/asteroid';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
  asteroids: Asteroid[];
}

export function MetricsGrid({ asteroids }: MetricsGridProps) {
  const total = asteroids.length;

  const largest = asteroids.reduce<Asteroid | null>((acc, a) => {
    const d = a.estimated_diameter_max_meters;
    if (d == null) return acc;
    if (!acc || d > (acc.estimated_diameter_max_meters ?? 0)) return a;
    return acc;
  }, null);

  const fastest = asteroids.reduce<Asteroid | null>((acc, a) => {
    const v = a.relative_velocity_km_h;
    if (v == null) return acc;
    if (!acc || v > (acc.relative_velocity_km_h ?? 0)) return a;
    return acc;
  }, null);

  const hazardousCount = asteroids.filter((a) => a.is_potentially_hazardous).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Asteroides Hoje"
        value={total}
        unit="objetos"
        icon={Orbit}
        accent="cyan"
      />
      <MetricCard
        label="Maior Diâmetro"
        value={largest?.estimated_diameter_max_meters ?? 0}
        unit="metros"
        icon={Ruler}
        accent="amber"
        hint={largest?.name}
        fractionDigits={1}
      />
      <MetricCard
        label="Mais Rápido"
        value={fastest?.relative_velocity_km_h ?? 0}
        unit="km/h"
        icon={Gauge}
        accent="green"
        hint={fastest?.name}
      />
      <MetricCard
        label="Ameaças Detectadas"
        value={hazardousCount}
        unit="hazardous"
        icon={AlertTriangle}
        accent="red"
      />
    </div>
  );
}
