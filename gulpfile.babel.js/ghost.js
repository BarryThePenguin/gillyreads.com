import ghost from 'ghost';
import path from 'path';
import {paths} from './config';

const config = path.resolve(paths.dirPath('config.js'));

export default () => ghost({config}).then(ghostServer => ghostServer.start());
