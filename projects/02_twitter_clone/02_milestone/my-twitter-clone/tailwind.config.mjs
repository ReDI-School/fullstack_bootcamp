/** tailwind.config.js - Week 6 */
/** Tailwind CSS configuration file for the Twitter Clone project */

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        twitterBlue: "#1DA1F2",
        darkGray: "#657786",
        lightGray: "#AAB8C2",
        extraLightGray: "#E1E8ED",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        tweet: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
