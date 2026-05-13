import { AlertOctagon, Calendar, ChevronRight, ShieldOff } from 'lucide-react';

import type { Asteroid } from '../types/asteroid';

interface ThreatTableProps {
  asteroids: Asteroid[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function ThreatTable({ asteroids, selectedId, onSelect }: ThreatTableProps) {
  const hazardous = asteroids.filter((a) => a.is_potentially_hazardous);

  return (
    <div className="panel-hud p-5 crt-lines">
      <div className="flex items-center gap-2 mb-4">
        <ShieldOff className="w-4 h-4 text-neon-red animate-pulse-glow" />
        <h2 className="font-display text-sm uppercase tracking-widest text-slate-200">
          Painel de Ameaças
        </h2>
        <span className="ml-auto font-mono text-xs text-slate-500">
          {hazardous.length} {hazardous.length === 1 ? 'objeto' : 'objetos'} crítico{hazardous.length === 1 ? '' : 's'}
        </span>
      </div>

      {hazardous.length === 0 ? (
        <div className="py-12 text-center font-mono text-sm text-slate-500">
          <ShieldOff className="w-10 h-10 mx-auto mb-3 text-slate-700" />
          <div className="text-slate-400">Nenhuma ameaça detectada no momento.</div>
          <div className="text-[11px] mt-1 text-slate-600">Mantenha o capacete por perto, só por garantia.</div>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {hazardous.map((a) => {
            const isSelected = a.nasa_neo_reference_id === selectedId;
            return (
              <li key={a.id}>
                <button
                  onClick={() => onSelect(a.nasa_neo_reference_id)}
                  className={`w-full text-left border rounded-md p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-neon-red bg-neon-red/15 shadow-neon-red'
                      : 'border-neon-red/20 bg-neon-red/5 hover:bg-neon-red/10 hover:border-neon-red/40'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <AlertOctagon className="w-4 h-4 text-neon-red flex-shrink-0 animate-pulse-glow" />
                      <span className="font-display font-bold text-base neon-text-red truncate">
                        {a.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(a.close_approach_date)}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-neon-red' : 'text-slate-600'}`}
                      />
                    </div>
                  </div>

                  {a.ai_threat_report ? (
                    <p className={`mt-3 text-sm leading-relaxed whitespace-pre-line transition-all ${
                      isSelected ? 'text-slate-200' : 'text-slate-400 line-clamp-2'
                    }`}>
                      {a.ai_threat_report}
                    </p>
                  ) : (
                    <p className="mt-3 font-mono text-xs italic text-slate-500">
                      [Relatório de ameaça não disponível]
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
