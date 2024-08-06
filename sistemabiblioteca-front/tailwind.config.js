/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-family-roboto)'],
        rubik: ['var(--font-family-rubik)'],
        montserrat: ['var(--font-family-montserrat)'],
        karla: ['var(--font-family-karla)'],
        roboto: ['var(--font-family-roboto)'],
        ubuntu: ['var(--font-family-ubuntu)'],
        bebas: ['var(--font-family-bebas)'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primarymi: {
          DEFAULT: "hsl(var(--primary-mi))",
          foreground: "hsl(var(--onPrimary-mi))",
        },
        primaryContainer: {
          DEFAULT: "hsl(var(--primaryContainer-mi))",
          foreground: "hsl(var(--onPrimaryContainer-mi))",
        },
        secondarmiy: {
          DEFAULT: "hsl(var(--secondary-mi))",
          foreground: "hsl(var(--onSecondary-mi))",
        },
        secondaryContainer: {
          DEFAULT: "hsl(var(--secondaryContainer-mi))",
          foreground: "hsl(var(--onSecondaryContainer-mi))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary-mi))",
          foreground: "hsl(var(--onTertiary-mi))",
        },
        tertiaryContainer: {
          DEFAULT: "hsl(var(--tertiaryContainer-mi))",
          foreground: "hsl(var(--onTertiaryContainer-mi))",
        },
        error: {
          DEFAULT: "hsl(var(--error-mi))",
          foreground: "hsl(var(--onError-mi))",
        },
        errorContainer: {
          DEFAULT: "hsl(var(--errorContainer-mi))",
          foreground: "hsl(var(--onErrorContainer-mi))",
        },
        backgroundmi: {
          DEFAULT: "hsl(var(--background-mi))",
          foreground: "hsl(var(--onBackground-mi))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface-mi))",
          foreground: "hsl(var(--onSurface-mi))",
        },
        surfaceVariant: {
          DEFAULT: "hsl(var(--surfaceVariant-mi))",
          foreground: "hsl(var(--onSurfaceVariant-mi))",
        },
        outline: {
          DEFAULT: "hsl(var(--outline-mi))",
          foreground: "hsl(var(--outlineVariant-mi))",
        },
        shadow: {
          DEFAULT: "hsl(var(--shadow-mi))",
          foreground: "hsl(var(--scrim-mi))",
        },
        inverseSurface: {
          DEFAULT: "hsl(var(--inverseSurface-mi))",
          foreground: "hsl(var(--inverseOnSurface-mi))",
        },
        inversePrimary: {
          DEFAULT: "hsl(var(--inversePrimary-mi))",
          foreground: "hsl(var(--foreground-mi))",
        },
        primaryFixed: {
          DEFAULT: "hsl(var(--primaryFixed-mi))",
          foreground: "hsl(var(--onPrimaryFixed-mi))",
        },
        primaryFixedDim: {
          DEFAULT: "hsl(var(--primaryFixedDim-mi))",
          foreground: "hsl(var(--onPrimaryFixedVariant-mi))",
        },
        secondaryFixed: {
          DEFAULT: "hsl(var(--secondaryFixed-mi))",
          foreground: "hsl(var(--onSecondaryFixed-mi))",
        },
        secondaryFixedDim: {
          DEFAULT: "hsl(var(--secondaryFixedDim-mi))",
          foreground: "hsl(var(--onSecondaryFixedVariant-mi))",
        },
        tertiaryFixed: {
          DEFAULT: "hsl(var(--tertiaryFixed-mi))",
          foreground: "hsl(var(--onTertiaryFixed-mi))",
        },
        tertiaryFixedDim: {
          DEFAULT: "hsl(var(--tertiaryFixedDim-mi))",
          foreground: "hsl(var(--onTertiaryFixedVariant-mi))",
        },
        surfaceDim: {
          DEFAULT: "hsl(var(--surfaceDim-mi))",
          foreground: "hsl(var(--surfaceBright-mi))",
        },
        surfaceContainerLowest: {
          DEFAULT: "hsl(var(--surfaceContainerLowest-mi))",
          foreground: "hsl(var(--surfaceContainerLow-mi))",
        },
        surfaceContainer: {
          DEFAULT: "hsl(var(--surfaceContainer-mi))",
          foreground: "hsl(var(--surfaceContainerHigh-mi))",
        },
        surfaceContainerHighest: {
          DEFAULT: "hsl(var(--surfaceContainerHighest-mi))",
          foreground: "hsl(var(--surfaceContainerHighest-mi))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}