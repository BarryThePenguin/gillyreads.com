const webpack = require('webpack');
const devConfig = require('../webpack.dev');
const prodConfig = require('../webpack.common');
const compileLogger = require('./lib/compile-logger');

const result = done => (err, stats) => {
	compileLogger(err, stats);
	done();
};

module.exports = done => {
	if (process.env.NODE_ENV === 'production') {
		webpack(
			{
				mode: 'production',
				...prodConfig
			},
			result(done)
		);
	} else {
		const compiler = webpack({
			mode: 'development',
			...devConfig
		});
		compiler.run(result(done));
	}
};
