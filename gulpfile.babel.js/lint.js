import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import error from './lib';

const $ = gulpLoadPlugins();

export default (files) => {
	return gulp.src(files)
		.pipe($.plumber(error.onError))
		.pipe($.xo());
};
