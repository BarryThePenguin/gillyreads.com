var assign = require('lodash.assign');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var ghost = require('ghost');
var gulp = require('gulp');
var lazypipe = require('lazypipe');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var theme = 'gill-and-angie';

if (plugins.util.env.theme) {
  theme = plugins.util.env.theme;
}

var basePaths = {
  common: './src/_common',
  src: './src/' + theme,
  dest: './content/themes/' + theme
};

var paths = {
  dest: basePaths.dest,
  style: {
    src: basePaths.src + '/css',
    dest: basePaths.dest + '/assets/css',
    watch: [
      basePaths.src + '/css/**/*.less',
      basePaths.common + '/css/**/*.less'
    ]
  },
  scripts: {
    src: basePaths.src + '/js/**/*',
    dest: basePaths.dest + '/assets/js',
    bundle: basePaths.src + '/js/index.js'
  },
  templates: {
    src: [
      basePaths.src + '/templates/**/*.hbs',
      basePaths.common + '/templates/**/*.hbs'
    ],
    dest: basePaths.dest
  },
  stuff: {
    src: basePaths.src + '/stuff/*',
    dest: basePaths.dest
  },
  fonts: {
    src: [
      basePaths.src + '/fonts/*.{eot,svg,ttf,woff,otf}',
      basePaths.common + '/fonts/*.{eot,svg,ttf,woff,otf}'
    ],
    dest: basePaths.dest + '/assets/fonts'
  }
};

var onError = {
  errorMessage: 'Error: <%= error.message %>',
  errorHandler: plugins.notify.onError(this.errorMessage)
};

function dirPath() {
  var params = [__dirname];
  params.push.apply(params, arguments);
  return path.join.apply(path, params);
}

function endsWithDefault(file) {
  var suffix = 'default.hbs';
  var position = file.path.length - suffix.length;
  return file.path.indexOf(suffix, position) !== -1;
}

var customOpts = {
  entries: paths.scripts.bundle,
  debug: true
};

var opts = assign({}, watchify.args, customOpts);
var bundler = watchify(browserify(opts));
bundler.transform('brfs');
bundler.on('update', lint);
bundler.on('update', scripts);
bundler.on('log', plugins.util.log);

gulp.task('clean', clean);
gulp.task('fonts', fonts);
gulp.task('ghost', openGhost);
gulp.task('open', open);
gulp.task('scripts', scripts);
gulp.task('stuff', stuff);
gulp.task('styles', styles);
gulp.task('templates', templates);
gulp.task('watch', watch);

gulp.task('build', gulp.series(
  clean,
  gulp.parallel(templates, styles, scripts, fonts, stuff)
));

var series = gulp.series('build', 'watch', 'ghost', 'open');
gulp.task('default', series);

function clean(done) {
  plugins.util.log('Cleaning ' + paths.dest);
  del(paths.dest, done);
}

function styles() {
  return gulp
    .src(path.join(paths.style.src, 'main.less'))
    .pipe(plugins.plumber(onError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    // .pipe(plugins.colorguard({
    //   threshold: 1
    // }))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.style.dest));
}

function lint() {
  return gulp.src(paths.scripts.src)
    .pipe(plugins.plumber(onError))
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.failOnError());
}

function scripts() {
  return bundler.bundle()
    .pipe(plugins.plumber(onError))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({
      loadMaps: true
    }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function templates() {
  function renameHtml(p) {
    p.extname = '.html';
  }

  function renameHbs(p) {
    p.extname = '.hbs';
  }

  var embedlr = lazypipe()
    .pipe(plugins.rename, renameHtml)
    .pipe(plugins.embedlr)
    .pipe(plugins.rename, renameHbs);

  return gulp.src(paths.templates.src, {
      since: gulp.lastRun('templates')
    })
    .pipe(plugins.plumber(onError))
    .pipe(plugins.if(endsWithDefault, embedlr()))
    .pipe(gulp.dest(paths.templates.dest));
}

function open() {
  return gulp.src(paths.dest + '/index.hbs')
    .pipe(plugins.plumber(onError))
    .pipe(plugins.open('', {
      url: 'http://localhost:' + 2368,
      app: 'chrome'
    }));
}

function stuff() {
  return gulp.src(paths.stuff.src)
    .pipe(gulp.dest(paths.stuff.dest));
}

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
}

function watch(done) {
  var livereload = plugins.livereload;

  livereload.listen({
    port: '35729'
  });

  gulp.watch(paths.style.watch, 'styles');
  gulp.watch(paths.templates.src, 'templates');
  gulp.watch(paths.fonts.src, 'fonts');

  gulp.watch(path.join(paths.scripts.dest, '/**/*.js'))
    .on('change', livereload.changed);

  gulp.watch(path.join(paths.style.dest, '/**/*.css'))
    .on('change', livereload.changed);

  gulp.watch(path.join(paths.templates.dest, '/**/*.hbs'))
    .on('change', livereload.reload);

  done();
}

function openGhost() {
  process.env.NODE_ENV = 'development';

  function startServer(ghostServer) {
    ghostServer.start();
  }

  return ghost({
    config: dirPath('config.js')
  }).then(startServer);
}
