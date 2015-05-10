var browserSync = require('browser-sync').create();

browserSync.init({
  proxy: 'http://localhost:2368',
  port: 3000,
  browser: ['google chrome']
});

module.exports = {
  server: browserSync,
  reload: browserSync.reload
};
