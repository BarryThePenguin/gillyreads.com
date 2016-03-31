import gulp from 'gulp';
import {paths} from './config';

export default () => {
	gulp.watch(paths.fonts.src, ['fonts']);
	gulp.watch(paths.src(), ['webpack']);
};
