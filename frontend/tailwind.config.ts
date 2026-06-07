import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: { max: "480px" },
      sm: "481px",
      md: "768px",
      lg: "992px",
      xl: "1300px",
    },
    extend: {
      colors: {
        "verde-floresta": "#3F6B4B",
        "laranja-solar": "#E59B3A",
        "bege-natural": "#EFE4D2",
        natural: "#EFE4D2",
        "verde-claro": "#A8C7A1",
        "preto-suave": "#2A2A2A",
        forest: "#3F6B4B",
        solar: "#E59B3A",
        "soft-black": "#2A2A2A",
        surface: {
          night: "#1A130D",
          muted: "#F4F6F4",
          forest: "#3F6B4B",
          charcoal: "#2A2F2C",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
