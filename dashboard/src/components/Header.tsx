import { useEffect, useState } from 'react';
import { Radar, Satellite, Signal } from 'lucide-react';

interface HeaderProps {
  lastUpdate?: string;
}

function useUtcClock(): string {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toISOString().slice(11, 19);
}

export function Header({ lastUpdate }: HeaderProps) {
  const utc = useUtcClock();

  return (
    <header className="relative z-10 border-b border-space-border bg-space-deep/70 backdrop-blur-md scan-overlay">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-xl animate-pulse-slow" />
            <Radar
              className="relative w-12 h-12 text-neon-cyan animate-spin-slow"
              strokeWidth={1.25}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-glow" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-wider neon-text-cyan glitch">
              PLANETARY DEFENSE
            </h1>
            <p className="font-mono text-[10px] text-slate-500 tracking-[0.3em] uppercase mt-1">
              Near-Earth Object Monitoring &middot; SYSTEM v0.2.0
            </p>
          </div>
        </div>

        <div className="flex items-stretch gap-3 font-mono text-xs">
          <div className="panel px-3 py-1.5 flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-neon-green animate-pulse-glow" />
            <div className="leading-tight">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest">Uplink</div>
              <div className="neon-text-green text-[11px]">ONLINE</div>
            </div>
          </div>
          <div className="panel px-3 py-1.5 flex items-center gap-2">
            <Satellite className="w-3.5 h-3.5 text-neon-cyan animate-float" />
            <div className="leading-tight">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest">UTC</div>
              <div className="neon-text-cyan text-[11px] tabular-nums">{utc}</div>
            </div>
          </div>
          {lastUpdate && (
            <div className="panel px-3 py-1.5 flex items-center gap-2">
              <div className="leading-tight">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">Last Sync</div>
                <div className="text-slate-300 text-[11px]">{lastUpdate}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
