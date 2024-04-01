/* eslint-env browser */

import "./css/main.css";
import { InstagramEmbed } from "./instagram-embed.js";

loadGoogleTagManager("GTM-TZFNZMF");

customElements.define("instagram-embed", InstagramEmbed);

function loadGoogleTagManager(id) {
	window.dataLayer ||= [];
	window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
	const f = document.querySelector("script");
	const index = document.createElement("script");
	index.async = true;
	index.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
	f?.parentNode?.insertBefore(index, f);
}
