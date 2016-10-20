import gutil from 'gulp-util';

export default (err, stats) => {
	if (err) {
		throw new gutil.PluginError('webpack', err);
	}

	gutil.log('[webpack:build]', stats.toString({
		colors: true
	}));
};
