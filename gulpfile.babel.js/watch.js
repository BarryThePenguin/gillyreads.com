import gulp from 'gulp';
// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default-member, import/no-named-as-default
import browserSync from 'browser-sync';
import {fonts, templates, src} from '../config/paths';

export default () => {
	gulp.watch(fonts.src, ['fonts']).on('change', browserSync.reload);
	gulp.watch(templates.watch, ['templates']).on('change', browserSync.reload);
	gulp.watch(src('/**/*'), ['webpack']).on('change', browserSync.reload);
};
