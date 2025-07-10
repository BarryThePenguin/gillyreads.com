import process from 'node:process';
import { pipeline } from 'node:stream';
import gulp from 'gulp';
import { deleteAsync } from 'del';
import gulpZip from 'gulp-zip';
import { task } from 'gulp-execa';
import log from 'fancy-log';
import browserSync from 'browser-sync';
import { build as vite } from 'vite';
import { copy } from './lib/copy.js';
import * as paths from './config/paths.js';

const { src, dest, series, parallel, watch } = gulp;

const { reload } = browserSync;

function clean(path = paths.destination()) {
	return () => {
		log(`Cleaning ${path}`);
		return deleteAsync(path);
	};
}

export const startGhost = task('podman compose up --detach');

export const stopGhost = task('podman compose down');

const extras = copy('extras');
const templates = copy('templates');

function zip(done) {
	return pipeline(src(paths.destination('**/*')), gulpZip('gillyreads.zip'), dest('.'), done);
}

async function serve() {
	watch(paths.templates.watch, series(clean(paths.templates.clean), templates)).on('change', reload);
	watch(paths.scripts.watch).on('change', () => reload());
	watch(paths.styles.watch).on('change', reload);
	watch(
		paths.source('**/*'),
		parallel(extras, () => vite()),
	);

	browserSync({
		proxy: 'http://localhost:2368',
		port: 3000,
		browser: 'default',
	});
}

const build = parallel(() => vite(), templates, extras);

export default process.env.NODE_ENV === 'production'
	? series(clean(), build, zip)
	: series(startGhost, clean(), build, serve);
