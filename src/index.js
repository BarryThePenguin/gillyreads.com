/* eslint-env browser */

/* eslint-disable import/no-unassigned-import */
import './css/main.css';
/* eslint-enable import/no-unassigned-import */

loadGoogleTagManager('GTM-TZFNZMF');
loadServiceWorker();

const instafeedElement = document.querySelector('.instafeed');

if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver(
		function (entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					loadInstafeed(entry.target);
					observer.disconnect();
				}
			});
		},
		{threshold: 0}
	);

	observer.observe(instafeedElement);
} else {
	loadInstafeed(instafeedElement);
}

function loadInstafeed(target) {
	import('instafeed.js').then(({default: Instafeed}) => createInstafeed({Instafeed, target}));
}

function createInstafeed({Instafeed, target}) {
	return fetch(
		'https://ig.instant-tokens.com/users/9af08e41-25eb-4ebc-96f9-bd8d5cda4b4b/instagram/17841400413312724/token?userSecret=wdo96hovcaf1d9xzsh7q9w'
	)
		.then(handleResponse)
		.then(function (result) {
			if (result.ok) {
				const large = window.matchMedia('(min-width: 768px)');

				new Instafeed({
					limit: large.matches ? 16 : 8,
					accessToken: result.Token,
					target
				}).run();
			}
		});
}

function handleResponse(response) {
	if (response.ok) {
		return response.json().then(tokenResult);
	}

	return Promise.resolve({ok: false});
}

function tokenResult({Token}) {
	return {ok: true, Token};
}

function loadServiceWorker() {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/sw.js');
		});
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
