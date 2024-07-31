/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          custom: "hsl(14, 86%, 42%)", // Custom Red
        },
        green: {
          custom: "hsl(159, 69%, 38%)", // Custom Green
        },
        rose: {
          50: "hsl(20, 50%, 98%)",
          100: "hsl(13, 31%, 94%)",
          300: "hsl(14, 25%, 72%)",
          400: "hsl(7, 20%, 60%)",
          500: "hsl(12, 20%, 44%)",
          900: "hsl(14, 65%, 9%)",
        },
      },
      screens: {
        xs: "500px",
      },
      gridTemplateColumns: {
        "desktop-layout": "2.5fr minmax(50px,1fr)",
      },
    },
  },
  plugins: [],
};
