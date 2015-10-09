import browserSync from 'browser-sync';

export default () => {
	browserSync({
		proxy: 'http://localhost:2368',
		port: 3000,
		browser: ['google chrome']
	});
};
