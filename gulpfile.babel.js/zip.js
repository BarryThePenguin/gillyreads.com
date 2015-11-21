import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import handleError from './lib';
import {paths} from './config';

const $ = gulpLoadPlugins();

export default () => gulp.src(paths.dest('**/*'))
	.pipe($.plumber(handleError))
	.pipe($.zip('gillian.zip'))
	.pipe(gulp.dest(paths.dest('../')));
