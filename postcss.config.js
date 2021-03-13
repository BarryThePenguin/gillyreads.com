const atImport = require('postcss-import');
const url = require('postcss-url');
const browserReporter = require('postcss-browser-reporter');
const reporter = require('postcss-reporter');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');

module.exports = {
	plugins: [
		atImport(),
		tailwindcss,
		url(),
		browserReporter(),
		reporter(),
		cssnano({
			preset: 'default'
		})
	]
};
