const webpack = require('webpack');
const {merge} = require('webpack-merge');
const devConfig = require('../webpack.dev');
const {legacyConfig, moduleConfig, serviceWorkerConfig} = require('../webpack.common');
const compileLogger = require('./lib/compile-logger');

const result = (done) => (error, stats) => {
	compileLogger(error, stats);
	done();
};

module.exports = (done) => {
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
		const compiler = webpack([legacyConfig, devConfig, serviceWorkerConfig]);
		compiler.run(result(done));
	}
};
