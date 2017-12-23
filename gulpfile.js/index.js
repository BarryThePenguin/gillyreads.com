const gulp = require('gulp');

const clean = require('./clean');
const extras = require('./extras');
const fonts = require('./fonts');
const serve = require('./serve');
const templates = require('./templates');
const watch = require('./watch');
const webpack = require('./webpack');
const zip = require('./zip');

gulp.task('clean', clean);
gulp.task('extras', extras);
gulp.task('fonts', fonts);
gulp.task('serve', ['webpack', 'extras', 'templates'], serve);
gulp.task('templates', templates);
gulp.task('watch', watch);
gulp.task('webpack', webpack);
gulp.task('zip', zip);

// Default task

function develop() {
	gulp.start('develop');
}

function build() {
	gulp.start('build');
}

gulp.task('develop', [
	'templates',
	'webpack',
	'templates',
	'fonts',
	'extras',
	'serve'
], watch);

gulp.task('build', ['webpack', 'templates', 'fonts', 'extras'], zip);

if (process.env.NODE_ENV === 'production') {
	gulp.task('default', ['clean'], build);
} else {
	gulp.task('default', ['clean'], develop);
}
