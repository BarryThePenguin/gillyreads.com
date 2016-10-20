import path from 'path';
import ghost from 'ghost';
import {dirPath} from '../config/paths';

const config = path.resolve(dirPath('config.js'));

export default () => ghost({config}).then(ghostServer => ghostServer.start());
