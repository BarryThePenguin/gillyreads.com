/* eslint-env browser */

import './css/main.css';
import {setupSearch} from './search.js';

loadGoogleTagManager('GTM-TZFNZMF');
setupSearch('[data-search-form]');
installServiceWorker(`/sw.js?${Date.now()}`);

const instafeed = loadInstafeed();

onIntersection('.instafeed', (target) => {
	instafeed.run(target).catch((error) => console.log(error));
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
			{threshold: 0},
		);

		observer.observe(element);
	} else {
		setTimeout(() => callback(element));
	}
}

function loadInstafeed() {
	const loadFeed = fetch('https://feeds.behold.so/1R6tyEunCryufxwGgOaZ').then(handleResponse);

	return {
		/**
		 *
		 * @param {HTMLElement} target
		 * @returns
		 */
		run(target) {
			return loadFeed.then((feed) => {
				for (const photo of feed) {
					const link = document.createElement('a');
					const image = document.createElement('img');
					link.href = photo.permalink;
					image.title = photo.caption;
					image.src = photo.mediaUrl;
					link.append(image);
					target.append(link);
				}
			});
		},
	};

	function handleResponse(response) {
		if (response.ok) {
			return response.json();
		}

		throw new Error(`Failed to fetch token. ${response.status}: ${response.statusText}`);
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
