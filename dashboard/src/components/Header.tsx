import { Radar, Satellite } from 'lucide-react';

interface HeaderProps {
  lastUpdate?: string;
}

export function Header({ lastUpdate }: HeaderProps) {
  return (
    <header className="relative z-10 border-b border-space-border bg-space-deep/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Radar
              className="w-10 h-10 text-neon-cyan animate-pulse-glow"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h1 className="font-mono text-2xl sm:text-3xl font-bold tracking-wider neon-text-cyan">
              PLANETARY DEFENSE SYSTEM
            </h1>
            <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mt-0.5">
              Near-Earth Object Monitoring &middot; v0.1.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Satellite className="w-4 h-4 text-neon-green animate-pulse-glow" />
          <div className="text-right">
            <div className="text-neon-green uppercase tracking-widest">Link Online</div>
            {lastUpdate && (
              <div className="text-slate-500">Sync: {lastUpdate}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
