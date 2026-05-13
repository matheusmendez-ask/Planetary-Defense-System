import { AlertOctagon, Gauge, Ruler, Target, X } from 'lucide-react';

import type { Asteroid } from '../types/asteroid';

interface SelectedAsteroidPanelProps {
  asteroid: Asteroid | null;
  onClose: () => void;
}

function formatNumber(n: number | null, fractionDigits = 0): string {
  if (n == null) return '—';
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
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

export function SelectedAsteroidPanel({ asteroid, onClose }: SelectedAsteroidPanelProps) {
  if (!asteroid) {
    return (
      <div className="absolute top-4 right-4 max-w-xs panel-hud p-4 font-mono text-xs text-slate-400 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="uppercase tracking-widest text-slate-500">Modo de Inspeção</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Clique em qualquer asteroide na cena 3D para inspecionar dados detalhados e relatório de ameaça.
        </p>
        <p className="mt-2 text-[10px] text-slate-500">
          &gt; Arraste para girar a câmera <br />
          &gt; Scroll para zoom <br />
          &gt; Vermelho = hazardous, ciano = seguro
        </p>
      </div>
    );
  }

  const hazardous = asteroid.is_potentially_hazardous;
  const accent = hazardous ? 'red' : 'cyan';
  const accentRing = hazardous ? 'border-neon-red/50 shadow-neon-red' : 'border-neon-cyan/40 shadow-neon-cyan';

  return (
    <div
      className={`absolute top-4 right-4 max-w-sm panel-hud p-5 backdrop-blur-md border ${accentRing} animate-float`}
      style={{ animationDuration: '8s' }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-500 hover:text-neon-cyan transition-colors"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        {hazardous ? (
          <AlertOctagon className="w-4 h-4 text-neon-red animate-pulse-glow" />
        ) : (
          <Target className="w-4 h-4 text-neon-cyan" />
        )}
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          {hazardous ? 'AMEAÇA DETECTADA' : 'OBJETO SEGURO'}
        </span>
      </div>

      <h3 className={`font-display text-lg font-bold ${accent === 'red' ? 'neon-text-red' : 'neon-text-cyan'} mb-3 pr-4`}>
        {asteroid.name}
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">
            <Ruler className="w-3 h-3" /> Diâmetro
          </div>
          <div className="text-slate-200">
            {formatNumber(asteroid.estimated_diameter_max_meters, 1)} <span className="text-slate-500">m</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">
            <Gauge className="w-3 h-3" /> Velocidade
          </div>
          <div className="text-slate-200">
            {formatNumber(asteroid.relative_velocity_km_h)} <span className="text-slate-500">km/h</span>
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">Distância</div>
          <div className="text-slate-200">
            {formatNumber(asteroid.miss_distance_km)} <span className="text-slate-500">km</span>
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">Aproximação</div>
          <div className="text-slate-200">{formatDate(asteroid.close_approach_date)}</div>
        </div>
      </div>

      {asteroid.ai_threat_report && (
        <div className="border-t border-space-border pt-3 max-h-48 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">
            &gt; Relatório de IA
          </div>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {asteroid.ai_threat_report}
          </p>
        </div>
      )}
    </div>
  );
}
