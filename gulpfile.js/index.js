const gulp = require('gulp');

const clean = require('./clean');
const extras = require('./extras');
const serve = require('./serve');
const templates = require('./templates');
const watch = require('./watch');
const webpack = require('./webpack');
const zip = require('./zip');

gulp.task('clean', clean);
gulp.task('extras', extras);
gulp.task('serve', serve);
gulp.task('templates', templates);
gulp.task('watch', watch);
gulp.task('webpack', webpack);
gulp.task('zip', zip);

gulp.task('build', gulp.parallel('webpack', 'templates', 'extras'));

if (process.env.NODE_ENV === 'production') {
	gulp.task('default', gulp.series('clean', 'build', 'zip'));
} else {
	gulp.task(
		'default',
		gulp.series('clean', 'build', gulp.parallel('serve', 'watch'))
	);
}
