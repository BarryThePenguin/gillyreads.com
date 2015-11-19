import gulp from 'gulp';
import watch from './watch';

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

gulp.task('build', ['webpack', 'templates', 'fonts', 'extras']);

if (process.env.NODE_ENV) {
	gulp.task('default', ['clean'], build);
} else {
	gulp.task('default', ['clean'], develop);
}
