const gulp = require('gulp');
const {reload} = require('browser-sync');
const {fonts, templates, src} = require('../config/paths');

module.exports = () => {
	gulp.watch(fonts.src, ['fonts']).on('change', reload);
	gulp.watch(templates.watch, ['templates']).on('change', reload);
	gulp.watch(src('/**/*'), ['webpack']).on('change', reload);
};
