const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('./config/paths');

module.exports = {
	output: {
		filename: '[name].js',
		path: path.resolve(paths.bundle.dest)
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
							name: 'static/[name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new LodashModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			name: '[name].css'
		})
	]
};
