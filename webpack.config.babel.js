import path from 'path';
import _ from 'lodash';
import autoprefixer from 'autoprefixer';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import lost from 'lost';
import pxtorem from 'postcss-pxtorem';
import lh from 'postcss-lh';
import webpack from 'webpack';
import WebpackNotifierPlugin from 'webpack-notifier';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';

import * as paths from './config/paths';

import packageJson from './package';

export default getConfig();

function getConfig() {
	let config = getCommonConfig();

	if (process.env.NODE_ENV === 'production') {
		config = _.merge(config, getProdConfig());
	} else {
		config = _.merge(config, getDevConfig());
	}

	return config;
}

function getCommonConfig() {
	return {
		context: path.resolve(paths.bundle.src),
		entry: {
			app: './js/index',
			styles: './css/main'
		},
		output: {
			path: path.resolve(paths.bundle.dest)
		},
		stats: {
			colors: true,
			reasons: true
		},
		resolve: {
			extensions: ['', '.js', '.scss']
		},
		postcss: getPostCss()
	};
}

function getDevConfig() {
	return {
		debug: true,
		devtool: 'eval',
		output: {
			filename: '[name].js'
		},
		module: {
			loaders: [
				getJavaScriptLoader(),
				getStyleLoader()
			]
		},
		plugins: _.union(getCommonPlugins(), [
			new BrowserSyncPlugin({
				host: 'localhost',
				port: '8080'
			}),
			new ExtractTextPlugin('[name].css', {
				allChunks: true
			})
		])
	};
}

function getProdConfig() {
	return {
		debug: true,
		devtool: 'source-map',
		output: {
			filename: '[name].js'
		},
		module: {
			loaders: [
				getJavaScriptLoader(),
				getStyleLoader()
			]
		},
		plugins: _.union(getCommonPlugins(), [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.optimize.AggressiveMergingPlugin(),
			new ExtractTextPlugin('[name].css', {
				allChunks: true
			})
		])
	};
}

function getJavaScriptLoader() {
	return {
		test: /\.js$/,
		loaders: ['babel', 'xo'],
		exclude: /node_modules/
	};
}

function getStyleLoader() {
	return {
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass'].join('!'))
	};
}

function getPostCss() {
	return [
		lh({
			rootSelector: ':root',
			rhythmUnit: 'lh',
			lineHeight: 1.5
		}),
		lost(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
		pxtorem()
	];
}

function getCommonPlugins() {
	return _.filter([
		new LodashModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			VERSION: JSON.stringify(packageJson.version)
		}),
		new WebpackNotifierPlugin()
	]);
}
