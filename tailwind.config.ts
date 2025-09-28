import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'oklch(0.11 0.012 264.472)',
                        foreground: 'oklch(0.985 0 0)',
                        card: {
                                DEFAULT: 'oklch(0.145 0.012 264.472)',
                                foreground: 'oklch(0.985 0 0)'
                        },
                        popover: {
                                DEFAULT: 'oklch(0.145 0.012 264.472)',
                                foreground: 'oklch(0.985 0 0)'
                        },
                        primary: {
                                DEFAULT: 'oklch(0.627 0.265 303.9)',
                                foreground: 'oklch(0.985 0 0)'
                        },
                        secondary: {
                                DEFAULT: 'oklch(0.269 0.012 264.472)',
                                foreground: 'oklch(0.985 0 0)'
                        },
                        muted: {
                                DEFAULT: 'oklch(0.145 0.012 264.472)',
                                foreground: 'oklch(0.708 0 0)'
                        },
                        accent: {
                                DEFAULT: 'oklch(0.269 0.012 264.472)',
                                foreground: 'oklch(0.985 0 0)'
                        },
                        destructive: {
                                DEFAULT: 'oklch(0.704 0.191 22.216)',
                                foreground: 'oklch(0.985 0 0)'
                        },
                        border: 'oklch(1 0 0 / 10%)',
                        input: 'oklch(1 0 0 / 15%)',
                        ring: 'oklch(0.627 0.265 303.9)',
                        chart: {
                                '1': 'oklch(0.488 0.243 264.376)',
                                '2': 'oklch(0.696 0.17 162.48)',
                                '3': 'oklch(0.769 0.188 70.08)',
                                '4': 'oklch(0.627 0.265 303.9)',
                                '5': 'oklch(0.645 0.246 16.439)'
                        }
                },
                borderRadius: {
                        lg: '0.625rem',
                        md: 'calc(0.625rem - 2px)',
                        sm: 'calc(0.625rem - 4px)'
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
