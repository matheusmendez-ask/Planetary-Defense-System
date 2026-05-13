import type { LucideIcon } from 'lucide-react';

import { AnimatedCounter } from './AnimatedCounter';

type Accent = 'cyan' | 'red' | 'green' | 'amber';

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  accent?: Accent;
  hint?: string;
  fractionDigits?: number;
}

const ACCENT_MAP: Record<Accent, { text: string; ringBorder: string; glow: string; iconBg: string }> = {
  cyan: {
    text: 'neon-text-cyan',
    ringBorder: 'border-neon-cyan/30 hover:border-neon-cyan/60',
    glow: 'hover:shadow-neon-cyan',
    iconBg: 'bg-neon-cyan/10 text-neon-cyan',
  },
  red: {
    text: 'neon-text-red',
    ringBorder: 'border-neon-red/40 hover:border-neon-red/70',
    glow: 'hover:shadow-neon-red',
    iconBg: 'bg-neon-red/10 text-neon-red',
  },
  green: {
    text: 'neon-text-green',
    ringBorder: 'border-neon-green/30 hover:border-neon-green/60',
    glow: 'hover:shadow-neon-green',
    iconBg: 'bg-neon-green/10 text-neon-green',
  },
  amber: {
    text: 'neon-text-amber',
    ringBorder: 'border-neon-amber/30 hover:border-neon-amber/60',
    glow: 'hover:shadow-neon-amber',
    iconBg: 'bg-neon-amber/10 text-neon-amber',
  },
};

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accent = 'cyan',
  hint,
  fractionDigits = 0,
}: MetricCardProps) {
  const colors = ACCENT_MAP[accent];

  const format = (n: number) =>
    n.toLocaleString('pt-BR', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

  return (
    <div
      className={`panel-hud p-5 border ${colors.ringBorder} ${colors.glow} transition-all duration-300 hover:-translate-y-1 group`}
    >
      <div className="flex items-start justify-between">
        <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
          {label}
        </div>
        <div className={`p-1.5 rounded ${colors.iconBg} group-hover:animate-pulse-glow`}>
          <Icon className="w-4 h-4" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`font-display text-3xl sm:text-4xl font-bold ${colors.text}`}>
          <AnimatedCounter value={value} format={format} />
        </span>
        {unit && (
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            {unit}
          </span>
        )}
      </div>

      {hint && (
        <div className="mt-2 font-mono text-[11px] text-slate-500 truncate" title={hint}>
          &gt; {hint}
        </div>
      )}
    </div>
  );
}
