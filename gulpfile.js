var gulp = require('gulp');
var tasks = require('./tasks');

function build() {
  gulp.start('build');
}

gulp.task('clean', tasks.clean);
gulp.task('fonts', tasks.fonts);
gulp.task('serve', tasks.serve);
gulp.task('scripts', tasks.scripts);
gulp.task('extras', tasks.extras);
gulp.task('styles', tasks.styles);
gulp.task('templates', tasks.templates);

gulp.task('build', [
  'templates',
  'styles',
  'scripts',
  'fonts',
  'extras'
], tasks.serve);

gulp.task('default', ['clean'], build);
