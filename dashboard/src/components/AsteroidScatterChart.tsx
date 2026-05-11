import { Crosshair } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

import type { Asteroid } from '../types/asteroid';

interface AsteroidScatterChartProps {
  asteroids: Asteroid[];
}

interface ScatterPoint {
  x: number;
  y: number;
  name: string;
  velocity: number | null;
}

function toPoint(a: Asteroid): ScatterPoint | null {
  if (a.miss_distance_km == null || a.estimated_diameter_max_meters == null) return null;
  return {
    x: a.miss_distance_km,
    y: a.estimated_diameter_max_meters,
    name: a.name,
    velocity: a.relative_velocity_km_h,
  };
}

function formatKm(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toFixed(0);
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScatterPoint }> }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="panel px-3 py-2 font-mono text-xs">
      <div className="neon-text-cyan font-bold">{point.name}</div>
      <div className="text-slate-300 mt-1">
        Distância: <span className="text-slate-100">{point.x.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km</span>
      </div>
      <div className="text-slate-300">
        Diâmetro: <span className="text-slate-100">{point.y.toFixed(1)} m</span>
      </div>
      {point.velocity != null && (
        <div className="text-slate-300">
          Velocidade: <span className="text-slate-100">{point.velocity.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} km/h</span>
        </div>
      )}
    </div>
  );
}

export function AsteroidScatterChart({ asteroids }: AsteroidScatterChartProps) {
  const safe = asteroids
    .filter((a) => !a.is_potentially_hazardous)
    .map(toPoint)
    .filter((p): p is ScatterPoint => p !== null);

  const hazardous = asteroids
    .filter((a) => a.is_potentially_hazardous)
    .map(toPoint)
    .filter((p): p is ScatterPoint => p !== null);

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Crosshair className="w-4 h-4 text-neon-cyan" />
        <h2 className="font-mono text-sm uppercase tracking-widest text-slate-300">
          Mapa de Trajetórias &middot; Distância × Diâmetro
        </h2>
      </div>

      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 30 }}>
            <CartesianGrid stroke="#13203a" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Distância"
              tickFormatter={formatKm}
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 11 }}
              label={{
                value: 'Miss distance (km)',
                position: 'insideBottom',
                offset: -15,
                fill: '#64748b',
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Diâmetro"
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 11 }}
              label={{
                value: 'Diâmetro (m)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                fill: '#64748b',
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
              }}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#00e5ff', strokeDasharray: '4 4', strokeOpacity: 0.4 }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            />
            <Scatter name="Seguros" data={safe} fill="#00e5ff" fillOpacity={0.7} />
            <Scatter name="Ameaças" data={hazardous} fill="#ff3860" fillOpacity={0.9} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
