var $ = require('gulp-load-plugins')();

var gulp = require('gulp');
var path = require('path');

var paths = require('../paths');
var error = require('./error');

var reload = require('./browserSync').reload;

function styles() {
  var autoprefixer = require('autoprefixer-core')({
    browsers: ['last 2 versions'],
    cascade: false
  });

  return gulp
    .src(path.join(paths.style.src, 'main.scss'))
    .pipe($.plumber(error.onError))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: [
        paths.bootstrap.style
      ]
    }))
    // .pipe($.colorguard({
    //   threshold: 1
    // }))
    .pipe($.postcss([autoprefixer]))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.style.dest))
    .pipe($.filter('**/*.css')).pipe(reload({
      stream: true
    }));
}

module.exports = styles;
