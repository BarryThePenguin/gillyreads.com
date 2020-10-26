const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('./config/paths');

const cssRule = {
	test: /\.css$/,
	use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
};

const fileRule = {
	loader: 'file-loader',
	exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
	options: {
		name: 'static/[name].[contenthash].[ext]'
	}
};

const plugins = [
	new MiniCssExtractPlugin({
		name: '[name].css'
	})
];

module.exports.legacyConfig = {
	mode: 'development',

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(paths.bundle.dest),
		publicPath: '/assets/'
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'usage',
										corejs: '3.6',
										targets: {
											esmodules: false
										}
									}
								]
							],
							plugins: ['@babel/plugin-syntax-dynamic-import']
						}
					},
					cssRule,
					fileRule
				]
			}
		]
	},
	plugins
};

module.exports.moduleConfig = {
	mode: 'development',

	output: {
		filename: '[name].mjs',
		path: path.resolve(paths.bundle.dest),
		publicPath: '/assets/'
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'usage',
										corejs: '3.6',
										targets: {
											esmodules: true
										}
									}
								]
							],
							plugins: ['@babel/plugin-syntax-dynamic-import']
						}
					},
					cssRule,
					fileRule
				]
			}
		]
	},
	plugins
};
