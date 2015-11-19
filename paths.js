var util = require('gulp-util');
var path = require('path');

var theme = 'gill-and-angie';

if (util.env.theme) {
  theme = util.env.theme;
}

function dirPath() {
  var params = [__dirname];
  params.push.apply(params, arguments);
  return path.join.apply(path, params);
}

function src(p) {
  return dirPath('/src/' + theme, p || '');
}

function common(p) {
  return dirPath('/src/_common', p || '');
}

function dest(p) {
  return dirPath('/content/themes/' + theme, p || '');
}

function deps(p) {
  return dirPath('/node_modules/', p || '');
}

var paths = {
  dest: dest(),
  style: {
    src: src('/css'),
    dest: dest('/assets/css'),
    watch: [
      src('/css/**/*.scss'),
      common('/css/**/*.scss')
    ]
  },
  scripts: {
    src: src('/js/**/*'),
    dest: dest('/assets/js'),
    bundle: src('/js/index.js')
  },
  templates: {
    src: [
      src('/templates/**/*.hbs'),
      common('/templates/**/*.hbs')
    ],
    dest: dest()
  },
  extras: {
    src: src('/stuff/*'),
    dest: dest()
  },
  fonts: {
    src: [
      src('/fonts/*.{eot,svg,ttf,woff,otf}'),
      common('/fonts/*.{eot,svg,ttf,woff,otf}')
    ],
    dest: dest('/assets/fonts')
  }
};

module.exports = paths;
