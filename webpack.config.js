const path = require('path');
const _ = require('lodash');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const paths = require('./config/paths');

const packageJson = require('./package');

module.exports = getConfig();

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
			extensions: ['.js', '.scss']
		}
	};
}

function getDevConfig() {
	return {
		output: {
			filename: '[name].js'
		},
		module: {
			rules: [
				getJavaScriptLoader(),
				getStyleLoader()
			]
		},
		plugins: _.union(getCommonPlugins(), [
			new webpack.SourceMapDevToolPlugin(),
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
			rules: [
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
		use: ['babel-loader', 'xo-loader'],
		exclude: /node_modules/
	};
}

function getStyleLoader() {
	return {
		test: /\.scss$/,
		use: ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: ['css-loader', 'postcss-loader', 'sass-loader']
		})
	};
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
