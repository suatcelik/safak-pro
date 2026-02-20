/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                safakDark: "#0f172a", // slate-900
                safakPrimary: "#10b981", // emerald-500
                safakSecondary: "#334155", // slate-700
            }
        },
    },
    plugins: [],
}