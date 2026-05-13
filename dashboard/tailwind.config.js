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
          pink: '#ff6ec7',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Orbitron"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.25), 0 0 1px rgba(0, 229, 255, 0.6) inset',
        'neon-red': '0 0 25px rgba(255, 56, 96, 0.35), 0 0 1px rgba(255, 56, 96, 0.7) inset',
        'neon-green': '0 0 20px rgba(0, 255, 156, 0.25), 0 0 1px rgba(0, 255, 156, 0.6) inset',
        'neon-amber': '0 0 20px rgba(255, 181, 71, 0.25), 0 0 1px rgba(255, 181, 71, 0.6) inset',
        panel: '0 0 0 1px rgba(26, 42, 74, 0.8), 0 10px 40px -10px rgba(0, 229, 255, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse-glow 4s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
        float: 'float 6s ease-in-out infinite',
        glitch: 'glitch 3s infinite',
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse': 'spin 18s linear infinite reverse',
        flicker: 'flicker 4s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 6px currentColor)' },
          '50%': { opacity: '0.65', filter: 'drop-shadow(0 0 16px currentColor)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glitch: {
          '0%, 92%, 100%': { transform: 'translate(0)', textShadow: '0 0 10px rgba(0,229,255,0.6)' },
          '93%': { transform: 'translate(2px, -1px)', textShadow: '-2px 0 #ff3860, 2px 0 #00e5ff' },
          '94%': { transform: 'translate(-2px, 1px)', textShadow: '2px 0 #ff3860, -2px 0 #00e5ff' },
          '95%': { transform: 'translate(1px, 1px)', textShadow: '0 0 10px rgba(0,229,255,0.8)' },
        },
        flicker: {
          '0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100%': { opacity: '1' },
          '20%, 21.9%, 63%, 63.9%, 65%, 69.9%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
