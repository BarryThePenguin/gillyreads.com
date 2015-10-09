// var $ = require('gulp-load-plugins')();
// var assign = require('lodash.assign');
// var browserify = require('browserify');
// var buffer = require('vinyl-buffer');
// var gulp = require('gulp');
// var source = require('vinyl-source-stream');
// var watchify = require('watchify');
//
// var error = require('./lib');
// var paths = require('./config');
// var reload = require('./browserSync').reload;
//
// var customOpts = {
//   entries: paths.scripts.bundle,
//   debug: true
// };
//
// var opts = assign({}, watchify.args, customOpts);
// var bundler = watchify(browserify(opts));
//
// function scripts() {
//   return bundler.bundle()
//     .pipe($.plumber(error.onError))
//     .pipe(source('bundle.js'))
//     .pipe(buffer())
//     .pipe($.sourcemaps.init({
//       loadMaps: true
//     }))
//     .pipe($.sourcemaps.write('./'))
//     .pipe($.filter('**/*.js'))
//     .pipe(gulp.dest(paths.scripts.dest))
//     .pipe(reload({
//       stream: true,
//       once: true
//     }));
// }
//
// bundler.transform('brfs');
// bundler.on('update', require('./lint'));
// bundler.on('update', scripts);
// bundler.on('log', $.util.log);
//
// module.exports = scripts;
