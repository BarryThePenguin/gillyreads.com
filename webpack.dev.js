const {merge} = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const {moduleConfig} = require('./webpack.common');

module.exports = merge(moduleConfig, {
	devtool: 'cheap-module-source-map',

	plugins: [new WebpackNotifierPlugin()]
});
