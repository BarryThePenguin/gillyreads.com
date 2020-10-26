const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('./config/paths');

module.exports = {
	output: {
		path: path.resolve(paths.bundle.dest),
		publicPath: '/assets/'
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.js$/,
						use: 'babel-loader',
						exclude: /node_modules/
					},
					{
						test: /\.css$/,
						use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
					},
					{
						loader: 'file-loader',
						exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
						options: {
							name: 'static/[name].[contenthash].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			name: '[name].css'
		})
	]
};
