import notify from 'gulp-notify';

const errorMessage = 'Error: <%= error.message %>';

export default notify.onError(errorMessage);
