/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            container: {
                screens: {
                    sm: '100%',
                    lg: '1100px',
                    xl: '1280px',
                    '2xl': '1440px',
                },
            },
        },
    },
    plugins: [],
};
