const atImport = require('postcss-import');
const url = require('postcss-url');
const presetEnv = require('postcss-preset-env');
const browserReporter = require('postcss-browser-reporter');
const reporter = require('postcss-reporter');
const cssnano = require('cssnano');
const {darken, lighten} = require('polished');
const tailwindcss = require('tailwindcss');

const grayBase = '#000';
const grayDarker = lighten(0.135, grayBase);
const grayDark = lighten(0.2, grayBase);
const gray = lighten(0.335, grayBase);
const grayLight = lighten(0.467, grayBase);
const grayLighter = lighten(0.935, grayBase);
const primaryGreen = '#408274';
const brandPrimary = primaryGreen;
const brandSuccess = '#5cb85c';
const brandInfo = '#5bc0de';
const brandWarning = '#f0ad4e';
const brandDanger = '#d9534f';

const link = brandPrimary;
const linkHover = darken(0.15, link);

const variables = {
	grayBase,
	grayDarker,
	grayDark,
	gray,
	grayLight,
	grayLighter,
	primaryGreen,
	brandPrimary,
	brandSuccess,
	brandInfo,
	brandWarning,
	brandDanger,
	text: grayDark,
	link,
	linkHover
};

module.exports = {
	plugins: [
		atImport(),
		tailwindcss('./tailwindcss'),
		url(),
		presetEnv({
			features: {
				'custom-properties': {
					appendVariables: true,
					variables
				}
			}
		}),
		browserReporter(),
		reporter(),
		cssnano({
			preset: 'default'
		})
	]
};
