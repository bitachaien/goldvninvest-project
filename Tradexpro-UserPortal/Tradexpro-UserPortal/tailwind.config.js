/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tradex-",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,

      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgba(var(--primary-color), 1)",
          one: "var(--text-primary-color)",
          two: "var(--text-primary-color-2)",
          three: "var(--text-primary-color-3)",
          four: "var(--text-primary-color-4)",
          3: "rgba(var(--primary-color), 0.03)",
          10: "rgba(var(--primary-color), 0.1)",
          30: "rgba(var(--primary-color), 0.3)",
          50: "rgba(var(--primary-color), 0.5)",
          60: "rgba(var(--primary-color), 0.6)",
        },
        border: {
          DEFAULT: "var(--border-color)",
          one: "var(--border-color-1)",
          two: "var(--border-colo2)",
        },
        hover: {
          primary: "var(--hover-color)",
          bg: "var(--hover-bg-color)",
        },
        font: {
          primary: "var(--font-color)",
        },
        body: "var(--bColor)",
        title: {
          DEFAULT: "var(--title-color)",
        },
        trade: {
          green: "var(--trade-green)",
          red: "var(--trade-red)",
        },
        white: {
          DEFAULT: "var(--white)",
        },
        black: {
          DEFAULT: "var(--black)",
        },
        glass: "var(--glass-color-bg-1)",
        pallet: "var(--color-pallet-1)",
        background: {
          DEFAULT: "var(--background-color)",
          primary: "var(--primary-background-color)",
          custom: "var(--custom-background-color)",
          trade: "var(--background-color-trade)",
          main: "var(--main-background-color)",
          card: "var(--card-background-color)",
          table: "var(--table-background-color)",
          footer: "var(--footer-background-color)",
          hover: "var(--background-color-hover)",
        },
        loading: {
          DEFAULT: "var(--loading-color)",
        },
        shadow: {
          DEFAULT: "var(--box-shadow-color)",
          primary: "var(--primary-box-shadow-color)",
          trade: "var(--background-color-trade)",
          main: "var(--main-background-color)",
          card: "var(--card-background-color)",
          table: "var(--table-background-color)",
          footer: "var(--footer-background-color)",
          hover: "var(--background-color-hover)",
        },
      },
    },
  },
  plugins: [],
};
