const gulp = require('gulp');
const {reload} = require('browser-sync');
const {fonts, templates, src} = require('../config/paths');

module.exports = () => {
	gulp.watch(fonts.src, gulp.task('fonts')).on('change', reload);
	gulp.watch(templates.watch, gulp.task('templates')).on('change', reload);
	gulp.watch(src('/**/*'), gulp.task('webpack')).on('change', reload);
};
