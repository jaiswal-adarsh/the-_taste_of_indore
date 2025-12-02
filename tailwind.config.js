/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'primary-dark': 'var(--color-primary-dark)',
                'primary-light': 'var(--color-primary-light)',
                secondary: 'var(--color-secondary)',
                'secondary-light': 'var(--color-secondary-light)',
                accent: 'var(--color-accent)',
                danger: 'var(--color-danger)',
                warning: 'var(--color-warning)',
                success: 'var(--color-success)',
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                'text-main': 'var(--color-text-main)',
                'text-muted': 'var(--color-text-muted)',
                border: 'var(--color-border)',
            },
            fontFamily: {
                sans: ['var(--font-sans)'],
                heading: ['var(--font-heading)'],
            },
            keyframes: {
                'slow-zoom': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                }
            },
            animation: {
                'slow-zoom': 'slow-zoom 20s linear infinite alternate',
            },
        },
    },
    plugins: [],
}
