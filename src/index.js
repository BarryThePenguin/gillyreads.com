/* eslint-env browser */

// eslint-disable-next-line import/no-unassigned-import
import './css/main.css';
import Instafeed from 'instafeed.js';

const large = window.matchMedia('(min-width: 768px)');

new Instafeed({
	get: 'user',
	limit: large.matches ? 16 : 8,
	userId: '174349777',
	resolution: 'low_resolution',
	accessToken: '174349777.1677ed0.d38d143ea61c4cc1a4562d62a3e41960',
	target: document.querySelector('.instafeed'),
}).run();
