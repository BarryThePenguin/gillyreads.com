const defaultTheme = require('tailwindcss/defaultTheme');
const paths = require('./config/paths');

module.exports = {
	purge: {
		enabled: true,
		content: paths.templates.src
	},
	theme: {
		extend: {
			colors: {
				twitter: '#1da1f2'
			},
			opacity: {
				'95': '.95',
			},
			fontFamily: {
				sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
				serif: ['"EB Garamond"', ...defaultTheme.fontFamily.serif]
			}
		}
	}
};
