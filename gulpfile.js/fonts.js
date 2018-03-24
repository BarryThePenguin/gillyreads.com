const gulp = require('gulp');

const {fonts} = require('../config/paths');

module.exports = () => gulp.src(fonts.src).pipe(gulp.dest(fonts.dest));
