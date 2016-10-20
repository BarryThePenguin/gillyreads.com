const path = require('path');
const ghost = require('ghost');

function startServer(ghostServer) {
	ghostServer.start();
}

ghost({
	config: path.join(__dirname, 'config.js')
}).then(startServer);
