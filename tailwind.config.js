/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily:{ 
        s_bold:["Roboto-Bold","sans-serif"],
        s_regular:["Roboto-Regular","sans-serif"],
        s_thin:["Roboto-Thin","sans-serif"], }

    },
  },
  plugins: ["nativewind/babel"],
}
