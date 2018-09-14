/* eslint-env browser */

import 'typeface-eb-garamond'; // eslint-disable-line import/no-unassigned-import
import 'typeface-quicksand'; // eslint-disable-line import/no-unassigned-import
import './css/main.css'; // eslint-disable-line import/no-unassigned-import

import Instafeed from 'instafeed.js';

const instafeedElement = document.querySelector('.instafeed');

if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					createInstafeed(entry.target).run();
					observer.disconnect();
				}
			});
		},
		{
			threshold: 0
		}
	);

	observer.observe(instafeedElement);
} else {
	createInstafeed(instafeedElement).run();
}

function createInstafeed(target) {
	const large = window.matchMedia('(min-width: 768px)');

	return new Instafeed({
		get: 'user',
		limit: large.matches ? 16 : 8,
		userId: '174349777',
		resolution: 'low_resolution',
		accessToken: '174349777.1677ed0.d38d143ea61c4cc1a4562d62a3e41960',
		target
	});
}
