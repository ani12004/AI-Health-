import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'ios-blue': '#0A84FF',
        'health-buddy-blue': '#00BFFF',
      },
      boxShadow: {
        'ios': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'ios-dark': '0 4px 12px rgba(0, 0, 0, 0.25)',
        'ios-lg': '0 10px 20px rgba(0, 0, 0, 0.08)',
        'ios-lg-dark': '0 10px 20px rgba(0, 0, 0, 0.25)',
        'glow-blue': '0 0 15px var(--glow-color)',
        'glow-blue-light': '0 0 8px var(--glow-color-faint)',
        'glow-selected': '0 0 12px var(--glow-color-faint)',
      },
      backgroundImage: {
        'gradient-futuristic': 'linear-gradient(225deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-futuristic-light': 'linear-gradient(225deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-fast': 'fadeInFast 0.2s ease-out forwards',
        'gradient-pan': 'gradientPan 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'message-in': 'messageIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(-5px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInFast: { '0%': { opacity: '0', transform: 'translateY(-5px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        gradientPan: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        glow: {
          'from': { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6', },
          'to': { textShadow: '0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6', },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px var(--glow-color-faint)' },
          '50%': { boxShadow: '0 0 20px var(--glow-color)' },
        },
        messageIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
