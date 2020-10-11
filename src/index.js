/* eslint-env browser */

/* eslint-disable import/no-unassigned-import */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'typeface-eb-garamond';
import 'typeface-quicksand';
import './css/main.css';
/* eslint-enable import/no-unassigned-import */

import Instafeed from 'instafeed.js';

window.addEventListener('load', async () => {
	await Promise.all([
		import('autotrack/lib/plugins/event-tracker'),
		import('autotrack/lib/plugins/outbound-link-tracker')
	]);

	ga('create', 'UA-78690357-1', 'auto');

	ga('require', 'eventTracker');
	ga('require', 'outboundLinkTracker');

	ga('send', 'pageview');
});

const instafeedElement = document.querySelector('.instafeed');

if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver(
		function (entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					createInstafeed(entry.target);
					observer.disconnect();
				}
			});
		},
		{threshold: 0}
	);

	observer.observe(instafeedElement);
} else {
	createInstafeed(instafeedElement);
}

async function createInstafeed(target) {
	const large = window.matchMedia('(min-width: 768px)');

	const result = await fetch(
		'https://ig.instant-tokens.com/users/9af08e41-25eb-4ebc-96f9-bd8d5cda4b4b/instagram/17841400413312724/token?userSecret=wdo96hovcaf1d9xzsh7q9w'
	);

	if (result.ok) {
		const {Token} = await result.json();

		new Instafeed({
			limit: large.matches ? 16 : 8,
			accessToken: Token,
			target
		}).run();
	}
}
