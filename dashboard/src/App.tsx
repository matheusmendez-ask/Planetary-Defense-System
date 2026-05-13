import { useMemo, useState } from 'react';
import { AlertCircle, Globe2, Loader2, RefreshCw } from 'lucide-react';

import { AsteroidScatterChart } from './components/AsteroidScatterChart';
import { Header } from './components/Header';
import { MetricsGrid } from './components/MetricsGrid';
import { SelectedAsteroidPanel } from './components/SelectedAsteroidPanel';
import { ThreatTable } from './components/ThreatTable';
import { EarthScene } from './components/three/EarthScene';
import { useAsteroids } from './hooks/useAsteroids';

function App() {
  const { asteroids, loading, error, refetch } = useAsteroids();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedAsteroid = useMemo(
    () => asteroids.find((a) => a.nasa_neo_reference_id === selectedId) ?? null,
    [asteroids, selectedId],
  );

  const lastUpdate = asteroids[0]?.created_at
    ? new Date(asteroids[0].created_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header lastUpdate={lastUpdate} />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {loading && (
          <div className="panel-hud p-16 flex flex-col items-center justify-center gap-3 font-mono text-sm text-slate-400">
            <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
            <span className="uppercase tracking-widest">Sincronizando com sensores orbitais...</span>
            <div className="text-[10px] text-slate-600">&gt; Conectando ao Supabase</div>
          </div>
        )}

        {error && !loading && (
          <div className="panel-hud p-6 border border-neon-red/40 shadow-neon-red">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-neon-red mt-0.5 flex-shrink-0 animate-pulse-glow" />
              <div className="flex-1">
                <h2 className="font-display text-sm font-bold neon-text-red uppercase tracking-widest">
                  Falha na Telemetria
                </h2>
                <p className="mt-2 text-sm text-slate-300">{error}</p>
                <button
                  onClick={refetch}
                  className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-colors font-mono text-xs uppercase tracking-widest"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && asteroids.length === 0 && (
          <div className="panel-hud p-16 text-center font-mono text-sm text-slate-400">
            <Globe2 className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            Nenhum asteroide registrado no banco. Execute o pipeline ETL primeiro.
          </div>
        )}

        {!loading && !error && asteroids.length > 0 && (
          <div className="space-y-6">
            <MetricsGrid asteroids={asteroids} />

            {/* Hero: 3D Earth Scene */}
            <div className="panel-hud overflow-hidden crt-lines">
              <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-space-border">
                <Globe2 className="w-4 h-4 text-neon-cyan animate-pulse-glow" />
                <h2 className="font-display text-sm uppercase tracking-widest text-slate-200">
                  Vetores Orbitais &middot; Visão 3D
                </h2>
                <span className="ml-auto font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                  Live Telemetry
                </span>
              </div>
              <div className="relative h-[560px] w-full bg-gradient-to-b from-space-black/40 to-space-deep/60">
                <EarthScene
                  asteroids={asteroids}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
                <SelectedAsteroidPanel
                  asteroid={selectedAsteroid}
                  onClose={() => setSelectedId(null)}
                />
                <div className="absolute bottom-3 left-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest pointer-events-none flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan shadow-neon-cyan" />
                    Seguro
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-neon-red shadow-neon-red animate-pulse-glow" />
                    Hazardous
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics row: scatter chart + threat table */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <AsteroidScatterChart asteroids={asteroids} />
              </div>
              <div className="lg:col-span-2">
                <ThreatTable
                  asteroids={asteroids}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-space-border bg-space-deep/40 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">
          Powered by NASA NeoWs &middot; Supabase &middot; Three.js &middot; Anthropic / OpenAI
        </div>
      </footer>
    </div>
  );
}

export default App;
