/* eslint-env browser */

import Instafeed from 'instafeed.js';

const large = window.matchMedia('(min-width: 768px)');

new Instafeed({
	get: 'user',
	limit: large.matches ? 16 : 8,
	userId: '174349777',
	resolution: 'low_resolution',
	accessToken: '31694633.32a8a43.4e2eb7ef66db45efae265d0264b15a0a',
	target: document.querySelector('.instafeed')
}).run();
