const gulp = require('gulp');

const {extras} = require('../config/paths');

module.exports = () => gulp.src(extras.src)
	.pipe(gulp.dest(extras.dest));
