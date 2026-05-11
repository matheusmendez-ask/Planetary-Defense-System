/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          black: '#04060d',
          deep: '#070b18',
          panel: '#0c1326',
          border: '#1a2a4a',
          grid: '#13203a',
        },
        neon: {
          cyan: '#00e5ff',
          red: '#ff3860',
          green: '#00ff9c',
          amber: '#ffb547',
          violet: '#a855f7',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.25), 0 0 1px rgba(0, 229, 255, 0.6) inset',
        'neon-red': '0 0 20px rgba(255, 56, 96, 0.25), 0 0 1px rgba(255, 56, 96, 0.6) inset',
        'neon-green': '0 0 20px rgba(0, 255, 156, 0.25), 0 0 1px rgba(0, 255, 156, 0.6) inset',
        panel: '0 0 0 1px rgba(26, 42, 74, 0.8), 0 10px 40px -10px rgba(0, 229, 255, 0.05)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(26,42,74,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(26,42,74,0.4) 1px, transparent 1px)',
        radial: 'radial-gradient(ellipse at top, rgba(0, 229, 255, 0.08), transparent 50%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        scan: 'scan 4s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 6px currentColor)' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 14px currentColor)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
