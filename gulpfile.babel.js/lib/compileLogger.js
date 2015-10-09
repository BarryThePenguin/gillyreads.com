import gutil from 'gulp-util';
import prettifyTime from './prettifyTime';
import handleError from './handleError';

export default (err, stats) => {
	if (err) {
		throw new gutil.PluginError('webpack', err);
	}

	let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';

	if (stats.compilation.errors.length > 0) {
		stats.compilation.errors.forEach(error => {
			handleError(error);
			statColor = 'red';
		});
	} else {
		const compileTime = prettifyTime(stats.endTime - stats.startTime);
		gutil.log(gutil.colors[statColor](stats));
		gutil.log('Compiled with', gutil.colors.cyan('webpack:development'), 'in', gutil.colors.magenta(compileTime));
	}
};
