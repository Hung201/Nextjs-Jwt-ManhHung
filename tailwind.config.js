/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1890ff',
                secondary: '#000',
            },
            boxShadow: {
                header: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false, // Disable Tailwind's reset
    },
} 