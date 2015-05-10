var ghost = require('ghost');
var path = require('path');

function startServer(ghostServer) {
  ghostServer.start();
}

ghost({
  config: path.join(__dirname, 'config.js')
}).then(startServer);
