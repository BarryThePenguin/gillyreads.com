var ghost = require('ghost');
var gulp = require('gulp');
var path = require('path');

var paths = require('../paths');

var styles = require('./styles');
var templates = require('./templates');
var fonts = require('./fonts');
var reload = require('./browserSync').reload;

function dirPath() {
  var params = [__dirname];
  params.push.apply(params, arguments);
  return path.join.apply(path, params);
}

function serve() {
  process.env.NODE_ENV = 'development';

  gulp.watch(paths.style.watch, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.fonts.src, fonts);

  gulp.watch([
    path.join(paths.templates.dest, '/**/*.hbs')
  ]).on('change', reload);

  function startServer(ghostServer) {
    ghostServer.start();
  }

  ghost({
    config: dirPath('../config.js')
  }).then(startServer);
}

module.exports = serve;
