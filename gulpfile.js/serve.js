// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default-member, import/no-named-as-default
const browserSync = require('browser-sync');

module.exports = () => {
	browserSync({
		proxy: 'http://localhost:2368',
		port: 3000,
		browser: ['google chrome'],
	});
};
