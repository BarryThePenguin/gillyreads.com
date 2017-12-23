const notify = require('gulp-notify');

const errorMessage = 'Error: <%= error.message %>';

module.exports = notify.onError(errorMessage);
