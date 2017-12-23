const webpack = require('webpack');
const config = require('../webpack.config');
const compileLogger = require('./lib/compile-logger');

const compiler = webpack(config);
const result = done => (err, stats) => {
	compileLogger(err, stats);
	done();
};

module.exports = done => {
	if (process.env.NODE_ENV) {
		webpack(config, result(done));
	} else {
		compiler.run(result(done));
	}
};
