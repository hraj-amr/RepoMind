export default {
  plugins: {
    "@tailwindcss/postcss": {
      content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',       // For App Router pages
        './src/**/*.{js,ts,jsx,tsx,mdx}',       // For components within src/
        './components/**/*.{js,ts,jsx,tsx,mdx}', // If you have a top-level components folder
        // Add any other specific paths where you use Tailwind classes
      ],
    },
  },
};
