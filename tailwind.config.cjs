const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

module.exports = {
	content: ['./src/**/*.{hbs,js}'],
	plugins: [typography],
	theme: {
		extend: {
			backgroundImage: {
				bookshelf: 'url("../../src/images/bookshelf.png")'
			},
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
							color: theme('colors.emerald.700'),
							transition: 'color 0.2s linear',
							textDecoration: 'none',
							'&:hover': {
								color: theme('colors.emerald.500')
							}
						},
						blockquote: {
							color: theme('colors.gray.500')
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
