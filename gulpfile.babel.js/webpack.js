import webpack from 'webpack';
import config from './config/webpack';
import {compileLogger} from './lib';

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
