import baseConfig from '../tailwind.base.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // Orders MFE specific customizations
      colors: {
        ...baseConfig.theme.extend.colors,
        primary: baseConfig.theme.extend.colors.atlassian, // Default to Atlassian theme
      },
    },
  },
};
