const gutil = require('gulp-util');

module.exports = (err, stats) => {
	if (err) {
		throw new gutil.PluginError('webpack', err);
	}

	gutil.log('[webpack:build]', stats.toString({
		colors: true
	}));
};
