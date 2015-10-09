import webpack from 'webpack';
import browserSync from 'browser-sync';

import config from './config/webpack';
import {compileLogger} from './lib';

const devConfig = config('development');

export default done => {
	let built = false;

	webpack(devConfig).watch(200, (err, stats) => {
		compileLogger(err, stats);
		browserSync.reload();
		// On the initial compile, let gulp know the task is done
		if (!built) {
			built = true;
			done();
		}
	});
};
