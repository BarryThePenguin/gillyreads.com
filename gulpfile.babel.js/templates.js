import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import {templates} from '../config/paths';
import handleError from './lib';

const $ = gulpLoadPlugins();

export default () => gulp.src(templates.src)
	.pipe($.plumber(handleError))
	.pipe(gulp.dest(templates.dest));
