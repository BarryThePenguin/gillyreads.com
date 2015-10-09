import gulp from 'gulp';
import {reload} from 'browser-sync';
import autoprefixer from 'autoprefixer';
import lost from 'lost';
import pxtorem from 'postcss-pxtorem';

import gulpLoadPlugins from 'gulp-load-plugins';

import {paths} from './config';
import {handleError} from './lib';

const $ = gulpLoadPlugins();

export default () => {
	const postcssConfig = [
		lost(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
		pxtorem()];

	const sassConfig = {
		outputStyle: 'expanded',
		precision: 10,
		includePaths: [paths.bootstrap.style]
	};

	return gulp
		.src(paths.style.src)
		.pipe($.plumber(handleError))
		.pipe($.sourcemaps.init())
		.pipe($.sass(sassConfig))
		.pipe($.postcss(postcssConfig))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(paths.style.dest))
		.pipe($.filter('**/*.css'))
		.pipe(reload({
			stream: true
		}));
};
