/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#1a1b26',
                surface: '#24283b',
                accent: {
                    blue: '#7aa2f7',
                    purple: '#bb9af7',
                },
                text: '#a9b1d6',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}
