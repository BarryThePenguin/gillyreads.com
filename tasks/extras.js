var gulp = require('gulp');

var paths = require('../paths');

function extras() {
  return gulp.src(paths.extras.src)
    .pipe(gulp.dest(paths.extras.dest));
}

module.exports = extras;
