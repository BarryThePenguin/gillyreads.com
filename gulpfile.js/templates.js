const gulp = require('gulp');

const {templates} = require('../config/paths');

module.exports = () => gulp.src(templates.src).pipe(gulp.dest(templates.dest));
