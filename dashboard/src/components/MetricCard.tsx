import type { LucideIcon } from 'lucide-react';

type Accent = 'cyan' | 'red' | 'green' | 'amber';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  accent?: Accent;
  hint?: string;
}

const ACCENT_MAP: Record<Accent, { text: string; ring: string; glow: string }> = {
  cyan: { text: 'neon-text-cyan', ring: 'ring-neon-cyan/30', glow: 'shadow-neon-cyan' },
  red: { text: 'neon-text-red', ring: 'ring-neon-red/30', glow: 'shadow-neon-red' },
  green: { text: 'neon-text-green', ring: 'ring-neon-green/30', glow: 'shadow-neon-green' },
  amber: { text: 'text-neon-amber', ring: 'ring-neon-amber/30', glow: 'shadow-neon-cyan' },
};

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accent = 'cyan',
  hint,
}: MetricCardProps) {
  const colors = ACCENT_MAP[accent];

  return (
    <div className={`panel p-5 ring-1 ${colors.ring} ${colors.glow}`}>
      <div className="flex items-start justify-between">
        <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
          {label}
        </div>
        <Icon className={`w-5 h-5 ${colors.text.replace('neon-text', 'text-neon')}`} strokeWidth={1.5} />
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`font-mono text-3xl sm:text-4xl font-bold ${colors.text}`}>
          {value}
        </span>
        {unit && (
          <span className="font-mono text-sm text-slate-500 uppercase tracking-wider">{unit}</span>
        )}
      </div>

      {hint && (
        <div className="mt-2 font-mono text-xs text-slate-500 truncate" title={hint}>
          {hint}
        </div>
      )}
    </div>
  );
}
