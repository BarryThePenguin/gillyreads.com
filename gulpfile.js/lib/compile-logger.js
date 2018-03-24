const log = require('fancy-log');
const PluginError = require('plugin-error');

module.exports = (err, stats) => {
	if (err) {
		throw new PluginError('webpack', err);
	}

	log(
		'[webpack:build]',
		stats.toString({
			colors: true,
		})
	);
};
