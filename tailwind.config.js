const colors = require('tailwindcss/colors')

module.exports = {
    enabled: true,
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "dle": "#084726",
            },
            animation: {
                reveal: "reveal 200ms forwards",
            },
        },
    },
    variants: {},
    plugins: [],
};
