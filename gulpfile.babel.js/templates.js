import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import handleError from './lib';
import {paths} from './config';

const $ = gulpLoadPlugins();

export default () => {
	return gulp.src(paths.templates.src)
    .pipe($.plumber(handleError))
    .pipe(gulp.dest(paths.templates.dest));
};
