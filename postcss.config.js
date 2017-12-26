const atImport = require('postcss-import');
const url = require('postcss-url');
const cssnext = require('postcss-cssnext');
const pxtorem = require('postcss-pxtorem');
const lh = require('postcss-lh');
const typography = require('postcss-typography');
const browserReporter = require('postcss-browser-reporter');
const reporter = require('postcss-reporter');
const { darken, lighten } = require('polished');

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

const headerFontFamily = ['Quicksand', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'];
const bodyFontFamily = ['EB Garamond', 'Georgia', 'Times New Roman', 'Times', 'serif'];

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
	linkHover,
	headerFontFamily: headerFontFamily.join(','),
	bodyFontFamily: bodyFontFamily.join(','),
};

module.exports = {
	plugins: [
		atImport(),
		url(),
		typography({
			googleFonts: [
				{
					name: 'EB Garamond',
					styles: ['400'],
				},
				{
					name: 'Open Sans',
					styles: ['400'],
				},
			],
			headerFontFamily,
			bodyFontFamily,
			baseFontSize: '20px',
			headerWeight: 'normal',
			bodyWeight: 'normal',
			scaleRatio: 2.96,
		}),
		cssnext({
			features: {
				customProperties: {
					variables,
				},
			},
		}),
		lh(),
		pxtorem(),
		browserReporter(),
		reporter(),
	],
};
