/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Primary color - #259d84
                primary: {
                    DEFAULT: "#259d84",
                    50: "#e6f7f4",
                    100: "#c3ebe4",
                    200: "#9dd9cf",
                    300: "#77c7ba",
                    400: "#51b5a5",
                    500: "#2ba390",
                    600: "#259d84", // primary
                    700: "#1f7a68",
                    800: "#19574c",
                    900: "#133430",
                },
                // Custom dark background - #020617
                dark: {
                    bg: "#020617",
                    50: "#1e293b",
                    100: "#0f172a",
                },
                // Custom light background - #e4e4e4
                light: {
                    bg: "#e4e4e4",
                },
            },
        },
    },
    plugins: [],
};