import ghost from 'ghost';
import path from 'path';

const dirPath = (...paths) => {
	const params = ['./'];
	params.push(...paths);
	return path.join(...params);
};

const config = path.resolve(dirPath('config.js'));

export default () => ghost({config}).then(ghostServer => ghostServer.start());
