// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default-member, import/no-named-as-default
import browserSync from 'browser-sync';

export default () => {
	browserSync({
		proxy: 'http://localhost:2368',
		port: 3000,
		browser: ['google chrome']
	});
};
