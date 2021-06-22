const {pipeline} = require('stream');
const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const gulpZip = require('gulp-zip');
const {task} = require('gulp-execa');
const log = require('fancy-log');
const browserSync = require('browser-sync');
const copy = require('./lib/copy');
const paths = require('../config/paths');

const webpack = require('./webpack');

const {reload} = browserSync;

function clean() {
	log(`Cleaning ${paths.dest()}`);
	return del(paths.dest());
}

const startGhost = task('ghost start --development');
const stopGhost = task('ghost stop');

const fonts = copy('fonts');
const extras = copy('extras');
const templates = copy('templates');
const images = copy('images');

function zip(done) {
	return pipeline(src(paths.dest('**/*')), gulpZip('gillyreads.zip'), dest('.'), done);
}

function serve() {
	watch(paths.fonts.src, fonts).on('change', reload);
	watch(paths.templates.watch, templates).on('change', reload);
	watch(paths.images.watch, images).on('change', reload);
	watch(paths.scripts.watch).on('change', () => reload());
	watch(paths.styles.watch).on('change', reload);
	watch(paths.src('**/*'), parallel(extras, webpack));

	browserSync({
		proxy: 'http://localhost:2369',
		port: 3000,
		browser: ['google chrome']
	});
}

const build = parallel(webpack, images, templates, extras);

exports['stop-ghost'] = stopGhost;

exports.default =
	process.env.NODE_ENV === 'production' ? series(clean, build, zip) : series(startGhost, clean, build, serve);
