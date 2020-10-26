/* eslint-env browser */

/* eslint-disable import/no-unassigned-import */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'typeface-quicksand';
import './css/main.css';
/* eslint-enable import/no-unassigned-import */
import Instafeed from 'instafeed.js';

loadGoogleTagManager('GTM-TZFNZMF');

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

function loadGoogleTagManager(id) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
	const f = document.querySelector('script');
	const j = document.createElement('script');
	j.async = true;
	j.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
	f.parentNode.insertBefore(j, f);
}
