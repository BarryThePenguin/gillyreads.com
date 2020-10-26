const {merge} = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const {moduleConfig} = require('./webpack.common');

module.exports = merge(moduleConfig, {
	devtool: 'cheap-module-source-map',

	plugins: [
		new WebpackNotifierPlugin(),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: '8080'
		})
	]
});
