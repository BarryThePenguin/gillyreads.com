/* eslint-env serviceworker */

import {cacheNames, skipWaiting} from 'workbox-core';
import {registerRoute} from 'workbox-routing';
import {CacheFirst, StaleWhileRevalidate, NetworkOnly} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';
import ky from 'ky';

skipWaiting();

// Ignore Admin
registerRoute(({url}) => url.pathname.startsWith('/ghost'), new NetworkOnly());

registerRoute(
	({url}) => url.origin === 'https://fonts.googleapis.com',
	new StaleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets'
	})
);

registerRoute(
	({url}) => url.origin === 'https://fonts.gstatic.com',
	new CacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200]
			}),
			new ExpirationPlugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30
			})
		]
	})
);

self.addEventListener('install', (event) => {
	const version = 'v3';

	const api = ky.create({
		prefixUrl: `https://gilly-reads.ghost.io/ghost/api/${version}/content`
	});

	api
		.get('posts', {
			key: 'c2bf893ce67fc9f7aaa96d0848',
			fields: 'id,url'
		})
		.json()
		.then(({posts}) => {
			const urls = posts.map(({url}) => url);
			const cacheName = cacheNames.runtime;

			event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
		})
		.catch((error) => console.log('Failed to warm cache', error));
});
