/* eslint-env browser */

import './css/main.css';
import Instafeed from 'instafeed.js';
import {setupSearch} from './search.js';

loadGoogleTagManager('GTM-TZFNZMF');
setupSearch('[data-search-form]');
installServiceWorker('/sw.js');

const instaFeedPromise = loadInstafeed();

onIntersection('.instafeed', (target) => {
	instaFeedPromise
		.then((accessToken) => createInstafeed(accessToken, target))
		.then((instafeed) => instafeed.run())
		.catch(console.error);
});

function onIntersection(target, callback) {
	const element = document.querySelector(target);
	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						callback(entry.target);
						observer.disconnect();
					}
				}
			},
			{threshold: 0}
		);

		observer.observe(element);
	} else {
		setTimeout(() => callback(element));
	}
}

function createInstafeed(accessToken, target) {
	const large = window.matchMedia('(min-width: 768px)');

	return new Instafeed({
		limit: large.matches ? 16 : 8,
		accessToken,
		target
	});
}

function loadInstafeed() {
	return fetch(
		'https://ig.instant-tokens.com/users/9af08e41-25eb-4ebc-96f9-bd8d5cda4b4b/instagram/17841400413312724/token?userSecret=wdo96hovcaf1d9xzsh7q9w'
	).then(handleResponse);

	function handleResponse(response) {
		if (response.ok) {
			return response.json().then(({Token}) => Token);
		}

		return Promise.reject(new Error(`Failed to fetch token. ${response.status}: ${response.statusText}`));
	}
}

function loadGoogleTagManager(id) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
	const f = document.querySelector('script');
	const j = document.createElement('script');
	j.async = true;
	j.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
	f.parentNode.insertBefore(j, f);
}

function installServiceWorker(path) {
	const url = new URL(window.location.href);

	if ('serviceWorker' in navigator && url.searchParams.get('sw') === 'true') {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register(path);
		});
	}
}
