import util from 'gulp-util';
import del from 'del';
import {dest} from '../config/paths';

export default () => {
	util.log(`Cleaning ${dest()}`);
	return del(dest());
};
