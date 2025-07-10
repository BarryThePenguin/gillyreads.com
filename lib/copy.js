import { pipeline } from 'node:stream';
import gulp from 'gulp';
import * as paths from '../config/paths.js';

const { src, dest } = gulp;

export function copy(path) {
	const copy = (done) => pipeline(src(paths[path].src), dest(paths[path].dest), done);
	copy.displayName = `copy:${path}`;
	return copy;
}
