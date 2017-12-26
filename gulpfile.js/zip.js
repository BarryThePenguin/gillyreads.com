const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const {dest} = require('../config/paths');
const handleError = require('./lib');

const $ = gulpLoadPlugins();

module.exports = () =>
	gulp
		.src(dest('**/*'))
		.pipe($.plumber(handleError))
		.pipe($.zip('gillian.zip'))
		.pipe(gulp.dest('.'));
