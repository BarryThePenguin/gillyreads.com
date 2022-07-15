import path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import * as paths from './config/paths.js';

const cssRule = {
	test: /\.css$/,
	use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
};

const fileRule = {
	test: /\.(png|svg|jpg|jpeg|gif)$/i,
	type: 'asset/resource',
};

const plugins = [
	new MiniCssExtractPlugin({
		filename: '[name].css',
	}),
];

export const legacyConfig = {
	mode: 'development',

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(paths.bundle.dest),
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
										corejs: '3.24',
									},
								],
							],
						},
					},
					cssRule,
					fileRule,
				],
			},
		],
	},
	plugins,
};

export const moduleConfig = {
	mode: 'development',

	output: {
		filename: '[name].mjs',
		path: path.resolve(paths.bundle.dest),
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
											esmodules: true,
										},
									},
								],
							],
							plugins: ['@babel/plugin-syntax-dynamic-import'],
						},
					},
					cssRule,
					fileRule,
				],
			},
		],
	},
	plugins,
};
