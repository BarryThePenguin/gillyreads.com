/* eslint-env browser */

export class InstagramEmbed extends HTMLElement {
	constructor() {
		super();

		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							entry.target.loadFeed();
							observer.disconnect();
						}
					}
				},
				{ threshold: 0 }
			);

			observer.observe(this);
		} else {
			setTimeout(() => this.loadFeed());
		}
	}

	loadFeed() {
		return fetch(this.getAttribute("src"))
			.then(handleResponse)
			.then((feed) => this.renderFeed(feed))
			.catch((error) => console.log(error));

		function handleResponse(response) {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Failed to fetch token. ${response.status}: ${response.statusText}`);
		}
	}

	renderFeed(feed) {
		for (const photo of feed.posts) {
			const link = document.createElement("a");
			const image = document.createElement("img");
			link.href = photo.permalink;
			image.alt = photo.caption;
			image.src = photo.sizes.medium.mediaUrl;
			image.width = photo.sizes.medium.width;
			image.height = photo.sizes.medium.height;

			link.append(image);
			this.append(link);
		}
	}
}
