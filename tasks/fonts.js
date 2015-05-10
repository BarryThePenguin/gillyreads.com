var gulp = require('gulp');

var paths = require('../paths');

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
}

module.exports = fonts;
