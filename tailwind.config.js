const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
const paths = require('./config/paths');

module.exports = {
	purge: {
		enabled: true,
		content: paths.templates.src
	},
	plugins: [typography],
	theme: {
		extend: {
			colors: {
				twitter: '#1da1f2'
			},
			opacity: {
				95: '.95'
			},
			fontFamily: {
				sans: ['Quicksand', ...defaultTheme.fontFamily.sans]
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						a: {
							color: theme('colors.green.600'),
							transition: 'color 0.2s linear',
							textDecoration: 'none',
							'&:hover': {
								color: theme('colors.green.800'),
								textDecoration: 'none'
							}
						},
						'h1, h2, h3, h4': {
							fontWeight: 'normal'
						},
						strong: {
							fontWeight: '500'
						}
					}
				}
			})
		}
	}
};
