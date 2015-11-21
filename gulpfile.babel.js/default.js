import gulp from 'gulp';
import watch from './watch';
import zip from './zip';

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

if (process.env.NODE_ENV) {
	gulp.task('default', ['clean'], build);
} else {
	gulp.task('default', ['clean'], develop);
}
