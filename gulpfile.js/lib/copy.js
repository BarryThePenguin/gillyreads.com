const {pipeline} = require('stream');
const {src, dest} = require('gulp');
const paths = require('../../config/paths');

module.exports = (path) => {
	const copy = (done) => pipeline(src(paths[path].src), dest(paths[path].dest), done);
	copy.displayName = `copy:${path}`;
	return copy;
};
