/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        currentColor: 'current',
        white: '#ffffff',
        primaryColor: {
          100: '#215ba8',
          80: '#4d7bb9',
          120: '#1a4886',
          40: '#a6bddc'
        }, 
        darkGrey: {
          100: '#555555',
          80: '#777777',
          120: '#444444'
        },
        lightGrey: {
          100: '#fafafa',
          80: '#fbfbfb',
          120: '#c8c8c8'
        },
        textDarkGrey: {
          100: '#333333',
          80: '#5b5b5b',
          120: '#282828'
        },
        textLightGrey: {
          100: '#e5e5e5',
          80: '#eaeaea',
          120: '#b7b7b7'
        },
        success: '#61ab51',
        warning: '#dc8333',
        failure: '#c94e4e',
        darkTheme1: {
          100: '#2d343d',
          80: '#575c63',
          120: '#242930'
        },
        darkTheme2: {
          100: '#222932',
          80: '#4e535b',
          120: '#1b2028'
        }
      },
    },

    colors: {
      transparent: 'transparent',
      currentColor: 'current',
      white: '#ffffff',
      primaryColor: {
        100: '#215ba8',
        80: '#4d7bb9',
        120: '#1a4886',
        40: '#a6bddc'
      }, 
      darkGrey: {
        100: '#555555',
        80: '#777777',
        120: '#444444'
      },
      lightGrey: {
        100: '#fafafa',
        80: '#fbfbfb',
        120: '#c8c8c8'
      },
      textDarkGrey: {
        100: '#333333',
        80: '#5b5b5b',
        120: '#282828'
      },
      textLightGrey: {
        100: '#e5e5e5',
        80: '#eaeaea',
        120: '#b7b7b7'
      },
      success: '#61ab51',
      warning: '#dc8333',
      failure: '#c94e4e',
      darkTheme1: {
        100: '#2d343d',
        80: '#575c63',
        120: '#242930'
      },
      darkTheme2: {
        100: '#222932',
        80: '#4e535b',
        120: '#1b2028'
      }
    },
    
  },
  plugins: [],
};
