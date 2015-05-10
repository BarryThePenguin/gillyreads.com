var util = require('gulp-util');
var del = require('del');
var paths = require('../paths');

function clean(done) {
  util.log('Cleaning ' + paths.dest);
  del(paths.dest, done);
}

module.exports = clean;
