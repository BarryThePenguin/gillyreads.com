/* eslint-env serviceworker */

import {cacheNames} from 'workbox-core';
import {registerRoute, setDefaultHandler, setCatchHandler} from 'workbox-routing';
import {CacheFirst, StaleWhileRevalidate, NetworkOnly} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';
import {precacheAndRoute, matchPrecache} from 'workbox-precaching';
import ky from 'ky';

const FALLBACK_HTML_URL = '/offline/';

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

// Ignore Admin
registerRoute(({url}) => url.pathname.startsWith('/ghost'), new NetworkOnly());

registerRoute(
	({request}) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
	}),
);

registerRoute(
	({url}) => url.origin === 'https://fonts.googleapis.com',
	new StaleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets',
	}),
);

registerRoute(
	({url}) => url.origin === 'https://fonts.gstatic.com',
	new CacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30,
			}),
		],
	}),
);

setDefaultHandler(new StaleWhileRevalidate());

setCatchHandler(async ({event}) => {
	if (event.request.destination === 'document') {
		return matchPrecache(FALLBACK_HTML_URL);
	}

	return Response.error();
});

self.addEventListener('install', (event) => {
	const version = 'v3';

	const api = ky.create({
		prefixUrl: `https://gilly-reads.ghost.io/ghost/api/${version}/content`,
	});

	event.waitUntil(
		caches.open(cacheNames.runtime).then((cache) => {
			cache.add(FALLBACK_HTML_URL);

			api
				.get('posts', {
					searchParams: {
						key: 'c2bf893ce67fc9f7aaa96d0848',
						fields: 'id,url',
					},
				})
				.json()
				.then(({posts}) => {
					const urls = posts.map(({url}) => url);
					cache.addAll(urls);
				})
				.catch((error) => console.log('Failed to warm cache', error));
		}),
	);
});
