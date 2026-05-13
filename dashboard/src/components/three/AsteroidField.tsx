import { useMemo } from 'react';

import type { Asteroid as AsteroidData } from '../../types/asteroid';
import { Asteroid } from './Asteroid';

interface AsteroidFieldProps {
  asteroids: AsteroidData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface Placed {
  asteroid: AsteroidData;
  position: [number, number, number];
  size: number;
}

/** Hash-based stable RNG so each asteroid keeps its 3D position across re-renders. */
function makeSeededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Logarithmic mapping from miss-distance (km) to a 3D shell radius around Earth. */
function distanceToRadius(missKm: number | null): number {
  if (missKm == null || missKm <= 0) return 3.5;
  const logMin = Math.log10(10_000);
  const logMax = Math.log10(50_000_000);
  const log = Math.log10(Math.max(missKm, 10_000));
  const t = Math.min(Math.max((log - logMin) / (logMax - logMin), 0), 1);
  return 1.7 + t * 2.8;
}

/** Map diameter to mesh size, clamped to a visually pleasant range. */
function diameterToSize(meters: number | null): number {
  if (meters == null || meters <= 0) return 0.04;
  const log = Math.log10(meters);
  return Math.max(0.03, Math.min(0.18, log * 0.035));
}

function placeAsteroids(asteroids: AsteroidData[]): Placed[] {
  return asteroids.map((a) => {
    const rng = makeSeededRandom(a.nasa_neo_reference_id);
    const radius = distanceToRadius(a.miss_distance_km);
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return {
      asteroid: a,
      position: [x, y, z],
      size: diameterToSize(a.estimated_diameter_max_meters),
    };
  });
}

export function AsteroidField({ asteroids, selectedId, onSelect }: AsteroidFieldProps) {
  const placed = useMemo(() => placeAsteroids(asteroids), [asteroids]);

  return (
    <group>
      {placed.map(({ asteroid, position, size }) => (
        <Asteroid
          key={asteroid.id}
          data={asteroid}
          position={position}
          size={size}
          selected={asteroid.nasa_neo_reference_id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
