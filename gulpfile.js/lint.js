const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const error = require('./lib');

const $ = gulpLoadPlugins();

module.exports = files =>
	gulp
		.src(files)
		.pipe($.plumber(error.onError))
		.pipe($.xo());
