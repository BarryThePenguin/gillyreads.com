import gulp from 'gulp';
import watch from './watch';

function develop() {
	gulp.start('develop');
}

gulp.task('develop', [
	'templates',
	'styles',
	'webpack',
	'templates',
	'fonts',
	'extras',
	'serve',
	'ghost'
], watch);

gulp.task('default', ['clean'], develop);
