import gulp from 'gulp';

import {paths} from './config';

export default () => {
	return gulp.src(paths.fonts.src)
		.pipe(gulp.dest(paths.fonts.dest));
};
