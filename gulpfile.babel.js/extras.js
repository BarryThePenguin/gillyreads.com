import gulp from 'gulp';

import {paths} from './config';

export default () => gulp.src(paths.extras.src)
	.pipe(gulp.dest(paths.extras.dest));
