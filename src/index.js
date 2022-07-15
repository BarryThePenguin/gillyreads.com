/* eslint-env browser */

import './css/main.css';
import {InstagramEmbed} from './instagram-embed.js';

loadGoogleTagManager('GTM-TZFNZMF');

customElements.define('instagram-embed', InstagramEmbed);

function loadGoogleTagManager(id) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
	const f = document.querySelector('script');
	const j = document.createElement('script');
	j.async = true;
	j.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
	f?.parentNode?.insertBefore(j, f);
}
