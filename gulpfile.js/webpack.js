const webpack = require('webpack');
const {merge} = require('webpack-merge');
const devConfig = require('../webpack.dev');
const {legacyConfig, moduleConfig} = require('../webpack.common');
const compileLogger = require('./lib/compile-logger');

const result = (done) => (err, stats) => {
	compileLogger(err, stats);
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
				})
			],
			result(done)
		);
	} else {
		const compiler = webpack([legacyConfig, devConfig]);
		compiler.run(result(done));
	}
};
