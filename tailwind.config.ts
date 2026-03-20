import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        warm: "hsl(var(--surface-warm))",
        elevated: "hsl(var(--surface-elevated))",
        amber: {
          DEFAULT: "hsl(var(--accent-amber))",
          subtle: "hsl(var(--accent-amber-subtle))",
        },
        tertiary: "hsl(var(--text-tertiary))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "soft": "0 1px 3px -1px hsl(var(--foreground) / 0.06), 0 1px 2px -1px hsl(var(--foreground) / 0.04)",
        "lifted": "0 4px 12px -3px hsl(var(--foreground) / 0.08), 0 2px 4px -2px hsl(var(--foreground) / 0.04)",
        "elevated": "0 8px 24px -6px hsl(var(--foreground) / 0.1), 0 4px 8px -4px hsl(var(--foreground) / 0.05)",
        "glow": "0 0 0 1px hsl(var(--accent) / 0.12), 0 2px 8px -2px hsl(var(--accent) / 0.1)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.22, 1, 0.36, 1)",
        "apple": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        "150": "150ms",
        "250": "250ms",
        "350": "350ms",
        "450": "450ms",
        "600": "600ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)", filter: "blur(3px)" },
          to: { opacity: "1", transform: "translateY(0)", filter: "blur(0px)" },
        },
        "fade-in-gentle": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "check-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "toggle-on": {
          "0%": { transform: "translateX(0) scale(1)" },
          "40%": { transform: "translateX(12px) scale(1.08, 0.92)" },
          "100%": { transform: "translateX(20px) scale(1)" },
        },
        "toggle-off": {
          "0%": { transform: "translateX(20px) scale(1)" },
          "40%": { transform: "translateX(8px) scale(1.08, 0.92)" },
          "100%": { transform: "translateX(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-fast": "fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-gentle": "fade-in-gentle 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-left": "slide-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-up": "slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        "check-pop": "check-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "toggle-on": "toggle-on 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "toggle-off": "toggle-off 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "pulse-soft": "pulse-soft 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
