import util from 'gulp-util';
import del from 'del';
import {paths} from './config';

export default () => {
	util.log(`Cleaning ${paths.dest}`);
	return del(paths.dest);
};
