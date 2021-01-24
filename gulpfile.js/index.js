const {pipeline} = require('stream');
const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const gulpZip = require('gulp-zip');
const log = require('fancy-log');
const {reload} = require('browser-sync');
const browserSync = require('browser-sync');
const paths = require('../config/paths');

const webpack = require('./webpack');

function clean() {
	log(`Cleaning ${paths.dest()}`);
	return del(paths.dest());
}

function fonts(done) {
	return pipeline(src(paths.fonts.src), dest(paths.fonts.dest), done);
}

function extras(done) {
	return pipeline(src(paths.extras.src), dest(paths.extras.dest), done);
}

function templates(done) {
	return pipeline(src(paths.templates.src), dest(paths.templates.dest), done);
}

function images(done) {
	return pipeline(src(paths.images.src), dest(paths.images.dest), done);
}

function zip(done) {
	return pipeline(src(paths.dest('**/*')), gulpZip('gillyreads.zip'), dest('.'), done);
}

function serve() {
	watch(paths.fonts.src, fonts).on('change', reload);
	watch(paths.templates.watch, templates).on('change', reload);
	watch(paths.images.watch, images).on('change', reload);
	watch(paths.src('/**/*'), parallel(extras, webpack)).on('change', reload);

	browserSync({
		proxy: 'http://localhost:2369',
		port: 3000,
		browser: ['google chrome']
	});
}

const build = parallel(webpack, images, templates, extras);

if (process.env.NODE_ENV === 'production') {
	exports.default = series(clean, build, zip);
} else {
	exports.default = series(clean, build, serve);
}
