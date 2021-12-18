import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {InjectManifest} from 'workbox-webpack-plugin';

import * as paths from './config/paths.js';

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
		filename: '[name].css'
	})
];

export const legacyConfig = {
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

export const moduleConfig = {
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

export const serviceWorkerConfig = {
	mode: 'development',
	entry: {},
	output: {
		path: path.resolve(paths.dest())
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
					}
				]
			}
		]
	},
	plugins: [
		new InjectManifest({
			swSrc: './src/sw.js'
		})
	]
};
