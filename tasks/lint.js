var $ = require('gulp-load-plugins')();

var gulp = require('gulp');
var error = require('./error');

function lint(files) {
  return gulp.src(files)
    .pipe($.plumber(error.onError))
    .pipe($.eslint())
    .pipe($.eslint.failOnError());
}

module.exports = lint;
