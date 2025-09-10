/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'ocean-green': '#059669',
        'ocean-blue': '#2563eb',
        'sail-white': '#f8fafc',
        'anchor-gray': '#475569',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 