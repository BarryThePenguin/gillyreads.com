const merge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
	devtool: 'cheap-module-source-map',

	plugins: [
		new WebpackNotifierPlugin(),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: '8080'
		})
	]
});
