import process from 'node:process';
import webpack from 'webpack';
import {merge} from 'webpack-merge';
import devConfig from './webpack.dev.js';
import {legacyConfig, moduleConfig, serviceWorkerConfig} from './webpack.common.js';
import {compileLogger} from './lib/compile-logger.js';

const result = (done) => (error, stats) => {
	compileLogger(error, stats);
	done(error);
};

let compiler;

export default function compile(done) {
	if (process.env.NODE_ENV === 'production') {
		webpack(
			[
				merge(legacyConfig, {
					mode: 'production',
				}),
				merge(moduleConfig, {
					mode: 'production',
				}),
				merge(serviceWorkerConfig, {
					mode: 'production',
				}),
			],
			result(done),
		);
	} else {
		if (typeof compiler === 'undefined') {
			compiler = webpack([devConfig, serviceWorkerConfig]);
		}

		compiler.run(result(done));
	}
}
