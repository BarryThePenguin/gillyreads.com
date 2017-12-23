const gulp = require('gulp');
// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default-member, import/no-named-as-default
const browserSync = require('browser-sync');
const {fonts, templates, src} = require('../config/paths');

module.exports = () => {
	gulp.watch(fonts.src, ['fonts']).on('change', browserSync.reload);
	gulp.watch(templates.watch, ['templates']).on('change', browserSync.reload);
	gulp.watch(src('/**/*'), ['webpack']).on('change', browserSync.reload);
};
