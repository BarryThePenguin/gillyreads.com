import gulp from 'gulp';

import clean from './clean';
import extras from './extras';
import fonts from './fonts';
import ghost from './ghost';
import serve from './serve';
import templates from './templates';
import watch from './watch';
import webpack from './webpack';
import zip from './zip';

gulp.task('clean', clean);
gulp.task('extras', extras);
gulp.task('fonts', fonts);
gulp.task('ghost', ['webpack', 'extras', 'templates'], ghost);
gulp.task('serve', ['ghost'], serve);
gulp.task('templates', templates);
gulp.task('watch', watch);
gulp.task('webpack', webpack);
gulp.task('zip', zip);

// default task

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
	'serve',
	'ghost'
], watch);

gulp.task('build', ['webpack', 'templates', 'fonts', 'extras'], zip);

if (process.env.NODE_ENV === 'production') {
	gulp.task('default', ['clean'], build);
} else {
	gulp.task('default', ['clean'], develop);
}
