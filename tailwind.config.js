const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	purge: {
		enabled: true,
		content: ['./src/**/*.hbs']
	},
	theme: {
		extend: {
			fontFamily: {
				sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
				serif: ['EB Garmond', ...defaultTheme.fontFamily.serif]
			}
		}
	}
};
