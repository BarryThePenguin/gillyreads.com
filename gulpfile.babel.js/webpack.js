import webpack from 'webpack';
import config from '../webpack.config.babel';
import compileLogger from './lib/compile-logger';

const compiler = webpack(config);
const result = done => (err, stats) => {
	compileLogger(err, stats);
	done();
};

export default done => {
	if (process.env.NODE_ENV) {
		webpack(config, result(done));
	} else {
		compiler.run(result(done));
	}
};
