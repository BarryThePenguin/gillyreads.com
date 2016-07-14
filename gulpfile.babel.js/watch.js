import gulp from 'gulp';
import browserSync from 'browser-sync';
import {paths} from './config';

export default () => {
	gulp.watch(paths.fonts.src, ['fonts']).on('change', browserSync.reload);
	gulp.watch(paths.templates.watch, ['templates']).on('change', browserSync.reload);
	gulp.watch(paths.src('/**/*'), ['webpack']).on('change', browserSync.reload);
};
