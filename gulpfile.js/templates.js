const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const {templates} = require('../config/paths');
const handleError = require('./lib');

const $ = gulpLoadPlugins();

module.exports = () => gulp.src(templates.src)
	.pipe($.plumber(handleError))
	.pipe(gulp.dest(templates.dest));
