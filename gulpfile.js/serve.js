const browserSync = require('browser-sync');

module.exports = () => {
	browserSync({
		proxy: 'http://localhost:2368',
		port: 3000,
		browser: ['google chrome']
	});
};
