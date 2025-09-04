/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1a1a1a',
        'paper-white': '#f8f6f0',
        'ink-gray': '#4a4a4a',
        'gold': '#d4af37',
        'jade': '#00a86b',
        'crimson': '#dc143c',
      },
      fontFamily: {
        'chinese': ['Noto Serif SC', 'serif'],
        'calligraphy': ['Ma Shan Zheng', 'cursive'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJwYXBlciIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj4KPGVsbGlwc2UgY3g9IjEwIiBjeT0iMTAiIHJ4PSIxIiByeT0iMSIgZmlsbD0iI2Y1ZjVmNSIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0idXJsKCNwYXBlcikiLz4KPHN2Zz4=')",
        'ink-wash': "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
}