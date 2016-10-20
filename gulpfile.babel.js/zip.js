import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import {dest} from '../config/paths';
import handleError from './lib';

const $ = gulpLoadPlugins();

export default () => gulp.src(dest('**/*'))
	.pipe($.plumber(handleError))
	.pipe($.zip('gillian.zip'))
	.pipe(gulp.dest(dest('../')));
