var notify = require('gulp-notify');

var errorMessage = 'Error: <%= error.message %>';

var onError = {
  errorHandler: notify.onError(errorMessage)
};

module.exports = {
  onError: onError
};
