import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

import { AsteroidScatterChart } from './components/AsteroidScatterChart';
import { Header } from './components/Header';
import { MetricsGrid } from './components/MetricsGrid';
import { ThreatTable } from './components/ThreatTable';
import { useAsteroids } from './hooks/useAsteroids';

function App() {
  const { asteroids, loading, error, refetch } = useAsteroids();

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
          <div className="panel p-12 flex flex-col items-center justify-center gap-3 font-mono text-sm text-slate-400">
            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
            <span className="uppercase tracking-widest">Sincronizando com sensores orbitais...</span>
          </div>
        )}

        {error && !loading && (
          <div className="panel p-6 ring-1 ring-neon-red/40 shadow-neon-red">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-neon-red mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="font-mono text-sm font-bold neon-text-red uppercase tracking-widest">
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
          <div className="panel p-12 text-center font-mono text-sm text-slate-400">
            Nenhum asteroide registrado no banco. Execute o pipeline ETL primeiro.
          </div>
        )}

        {!loading && !error && asteroids.length > 0 && (
          <div className="space-y-6">
            <MetricsGrid asteroids={asteroids} />
            <AsteroidScatterChart asteroids={asteroids} />
            <ThreatTable asteroids={asteroids} />
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-space-border bg-space-deep/40 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">
          Powered by NASA NeoWs &middot; Supabase &middot; Anthropic / OpenAI
        </div>
      </footer>
    </div>
  );
}

export default App;
