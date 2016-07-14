/* eslint-env browser */

import Instafeed from 'instafeed.js';

const large = window.matchMedia('(min-width: 768px)');

new Instafeed({
	get: 'user',
	limit: large.matches ? 16 : 8,
	userId: '174349777',
	resolution: 'low_resolution',
	accessToken: '174349777.32a8a43.5d8e5946f9714ec9bf596aeea7054431',
	target: document.querySelector('.instafeed')
}).run();
