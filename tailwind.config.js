const colors = require('tailwindcss/colors')

module.exports = {
    enabled: true,
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "dle": "#195234",
            },
        },
    },
    variants: {},
    plugins: [],
};
