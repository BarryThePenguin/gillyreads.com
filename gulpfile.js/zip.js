const gulp = require('gulp');
const zip = require('gulp-zip');

const {dest} = require('../config/paths');

module.exports = () =>
	gulp
		.src(dest('**/*'))
		.pipe(zip('gillian.zip'))
		.pipe(gulp.dest('.'));
