import {pipeline} from 'stream';
import gulp from 'gulp';
import del from 'del';
import gulpZip from 'gulp-zip';
import {task} from 'gulp-execa';
import log from 'fancy-log';
import browserSync from 'browser-sync';
import {copy} from './lib/copy.js';
import * as paths from './config/paths.js';

import webpack from './webpack.js';

const {src, dest, series, parallel, watch} = gulp;

const {reload} = browserSync;

function clean() {
	log(`Cleaning ${paths.dest()}`);
	return del(paths.dest());
}

export const startGhost = task('ghost start --development');
export const upgradeGhost = task('ghost update');
export const stopGhost = task('ghost stop');

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
		browser: ['firefox']
	});
}

const build = parallel(webpack, images, templates, extras);

export default process.env.NODE_ENV === 'production'
	? series(clean, build, zip)
	: series(startGhost, clean, build, serve);
