import gulp from 'gulp';

import {fonts} from '../config/paths';

export default () => gulp.src(fonts.src)
	.pipe(gulp.dest(fonts.dest));
