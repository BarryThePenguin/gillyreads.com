import ghost from 'ghost';
import path from 'path';

const dirPath = (...paths) => {
	const params = ['./'];
	params.push(...paths);
	return path.join(...params);
};

export default () => {
	var config = path.resolve(dirPath('config.js'));
	return ghost({config}).then(ghostServer => {
		return ghostServer.start();
	});
};
