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
                        background: '#111827',
                        foreground: '#ffffff',
                        card: {
                                DEFAULT: '#1f2937',
                                foreground: '#ffffff'
                        },
                        popover: {
                                DEFAULT: '#1f2937',
                                foreground: '#ffffff'
                        },
                        primary: {
                                DEFAULT: '#3b82f6',
                                foreground: '#ffffff'
                        },
                        secondary: {
                                DEFAULT: '#374151',
                                foreground: '#ffffff'
                        },
                        muted: {
                                DEFAULT: '#1f2937',
                                foreground: '#9ca3af'
                        },
                        accent: {
                                DEFAULT: '#374151',
                                foreground: '#ffffff'
                        },
                        destructive: {
                                DEFAULT: '#ef4444',
                                foreground: '#ffffff'
                        },
                        border: '#374151',
                        input: '#374151',
                        ring: '#3b82f6',
                        chart: {
                                '1': '#3b82f6',
                                '2': '#10b981',
                                '3': '#f59e0b',
                                '4': '#ef4444',
                                '5': '#8b5cf6'
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