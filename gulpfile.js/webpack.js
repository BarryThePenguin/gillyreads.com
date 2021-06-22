const webpack = require('webpack');
const {merge} = require('webpack-merge');
const devConfig = require('../webpack.dev');
const {legacyConfig, moduleConfig, serviceWorkerConfig} = require('../webpack.common');
const compileLogger = require('./lib/compile-logger');

const result = (done) => (error, stats) => {
	compileLogger(error, stats);
	done(error);
};

let compiler;

function compile(done) {
	if (process.env.NODE_ENV === 'production') {
		webpack(
			[
				merge(legacyConfig, {
					mode: 'production'
				}),
				merge(moduleConfig, {
					mode: 'production'
				}),
				merge(serviceWorkerConfig, {
					mode: 'production'
				})
			],
			result(done)
		);
	} else {
		if (typeof compiler === 'undefined') {
			compiler = webpack([devConfig, serviceWorkerConfig]);
		}

		compiler.run(result(done));
	}
}

module.exports = compile;
