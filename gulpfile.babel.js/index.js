import gulp from 'gulp';

import './default';

import clean from './clean';
import extras from './extras';
import fonts from './fonts';
import html from './html';
import ghost from './ghost';
import serve from './serve';
import templates from './templates';
import watch from './watch';
import webpack from './webpack';

gulp.task('clean', clean);
gulp.task('extras', extras);
gulp.task('fonts', fonts);
gulp.task('html', html);
gulp.task('ghost', ['webpack', 'extras', 'templates'], ghost);
gulp.task('serve', ['ghost'], serve);
gulp.task('templates', templates);
gulp.task('watch', watch);
gulp.task('webpack', webpack);
