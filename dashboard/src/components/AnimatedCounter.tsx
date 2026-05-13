import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}

/** Animates a number from its previous value to `value` with an ease-out cubic curve. */
export function AnimatedCounter({
  value,
  duration = 1200,
  format = (n) => Math.round(n).toLocaleString('pt-BR'),
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState<number>(value);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = from + (value - from) * eased;
      setDisplay(current);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{format(display)}</>;
}
