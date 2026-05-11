import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import type { Asteroid } from '../types/asteroid';

interface UseAsteroidsResult {
  asteroids: Asteroid[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAsteroids(): UseAsteroidsResult {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('asteroids')
        .select('*')
        .order('close_approach_date', { ascending: false })
        .order('estimated_diameter_max_meters', { ascending: false });

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
        setAsteroids([]);
      } else {
        setAsteroids((data ?? []) as Asteroid[]);
      }
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return {
    asteroids,
    loading,
    error,
    refetch: () => setTick((n) => n + 1),
  };
}
