const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const packageJson = require('./package');
const paths = require('./config/paths');

module.exports = {
	context: path.resolve(paths.bundle.src),
	entry: {
		app: './js/index',
		styles: './css/main'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(paths.bundle.dest)
	},
	stats: {
		colors: true,
		reasons: true
	},
	resolve: {
		extensions: ['.js', '.css']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader', 'xo-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {importLoaders: 1}
						},
						'postcss-loader'
					]
				})
			}
		]
	},
	plugins: [
		new LodashModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(packageJson.version)
		}),
		new ExtractTextPlugin('[name].css', {
			allChunks: true
		})
	]
};
