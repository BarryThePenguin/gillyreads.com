const log = require('fancy-log');
const PluginError = require('plugin-error');

module.exports = (error, stats) => {
	if (error) {
		throw new PluginError('webpack', error);
	}

	log(
		'[webpack:build]',
		stats.toString({
			colors: true
		})
	);
};
