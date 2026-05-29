import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: { max: '480px' },
      sm: { min: '481px', max: '767px' },
      md: { min: '768px', max: '991px' },
      lg: { min: '992px', max: '1299px' },
      xl: '1300px',
    },
    extend: {
      colors: {
        'verde-floresta': '#3F6B4B',
        'laranja-solar': '#E59B3A',
        'bege-natural': '#EFE4D2',
        'verde-claro': '#A8C7A1',
        'preto-suave': '#2A2A2A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config
