import { AlertOctagon, Calendar, ShieldOff } from 'lucide-react';

import type { Asteroid } from '../types/asteroid';

interface ThreatTableProps {
  asteroids: Asteroid[];
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

export function ThreatTable({ asteroids }: ThreatTableProps) {
  const hazardous = asteroids.filter((a) => a.is_potentially_hazardous);

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldOff className="w-4 h-4 text-neon-red animate-pulse-glow" />
        <h2 className="font-mono text-sm uppercase tracking-widest text-slate-300">
          Painel de Ameaças
        </h2>
        <span className="ml-auto font-mono text-xs text-slate-500">
          {hazardous.length} {hazardous.length === 1 ? 'objeto crítico' : 'objetos críticos'}
        </span>
      </div>

      {hazardous.length === 0 ? (
        <div className="py-12 text-center font-mono text-sm text-slate-500">
          <ShieldOff className="w-8 h-8 mx-auto mb-2 text-slate-700" />
          Nenhuma ameaça detectada no momento. Mantenha o capacete por perto.
        </div>
      ) : (
        <ul className="space-y-4">
          {hazardous.map((a) => (
            <li
              key={a.id}
              className="border border-neon-red/20 rounded-md p-4 bg-neon-red/5 hover:bg-neon-red/10 transition-colors"
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-neon-red flex-shrink-0" />
                  <span className="font-mono font-bold text-base neon-text-red">
                    {a.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Aproximação: {formatDate(a.close_approach_date)}</span>
                </div>
              </div>

              {a.ai_threat_report ? (
                <p className="mt-3 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {a.ai_threat_report}
                </p>
              ) : (
                <p className="mt-3 font-mono text-xs italic text-slate-500">
                  [Relatório de ameaça não disponível]
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
