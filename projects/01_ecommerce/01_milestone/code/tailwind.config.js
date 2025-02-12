/**
 * tailwind.config.js
 * This file configures Tailwind CSS for the project.
 * It specifies the content paths to ensure all classes are processed.
 */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Custom primary color
        secondary: "#FACC15", // Custom secondary color
      },
    },
  },
  plugins: [],
};
