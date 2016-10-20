import gulp from 'gulp';

import {extras} from '../config/paths';

export default () => gulp.src(extras.src)
	.pipe(gulp.dest(extras.dest));
