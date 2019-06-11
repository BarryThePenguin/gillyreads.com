const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	theme: {
		extend: {
			fontFamily: {
				sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
				serif: ['EB Garmond', ...defaultTheme.fontFamily.serif]
			}
		}
	}
};
