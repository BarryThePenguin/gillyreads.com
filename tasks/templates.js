var gulp = require('gulp');
var plumber = require('gulp-plumber');

var error = require('./error');
var paths = require('../paths');

function templates() {
  return gulp.src(paths.templates.src)
    .pipe(plumber(error.onError))
    .pipe(gulp.dest(paths.templates.dest));
}

module.exports = templates;
