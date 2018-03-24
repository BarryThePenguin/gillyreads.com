const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('./config/paths');

module.exports = {
	output: {
		filename: '[name].js',
		path: path.resolve(paths.bundle.dest),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {importLoaders: 1},
					},
					'postcss-loader',
				],
			},
		],
	},
	plugins: [
		new LodashModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			name: '[name].css',
			allChunks: true,
		}),
	],
};
