import {merge} from 'webpack-merge';
import WebpackNotifierPlugin from 'webpack-notifier';
import {moduleConfig} from './webpack.common.js';

export default merge(moduleConfig, {
	devtool: 'cheap-module-source-map',

	plugins: [new WebpackNotifierPlugin()],
});
