export class InstagramEmbed extends HTMLElement {
	#timeoutId;
	static observer =
		'IntersectionObserver' in globalThis
			? new IntersectionObserver(
					(entries) => {
						for (const entry of entries) {
							if (entry.isIntersecting) {
								entry.target.loadFeed();
								InstagramEmbed.observer.unobserve(entry.target);
							}
						}
					},
					{ threshold: 0 },
				)
			: null;

	connectedCallback() {
		if (InstagramEmbed.observer) {
			InstagramEmbed.observer.observe(this);
		} else {
			this.#timeoutId = setTimeout(() => this.loadFeed());
		}
	}

	disconnectedCallback() {
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
		}
	}

	async loadFeed() {
		try {
			const response = await fetch(this.getAttribute('src'));
			const feed = await handleResponse(response);
			return this.renderFeed(feed);
		} catch (error) {
			return console.log(error);
		}

		function handleResponse(response) {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Failed to fetch token. ${response.status}: ${response.statusText}`);
		}
	}

	renderFeed(feed) {
		const shadow = this.attachShadow({ mode: 'open' });

		for (const photo of feed.posts) {
			const link = document.createElement('a');
			const image = document.createElement('img');
			link.href = photo.permalink;
			image.alt = photo.caption;
			image.src = photo.sizes.medium.mediaUrl;
			image.width = photo.sizes.medium.width;
			image.height = photo.sizes.medium.height;

			link.append(image);
			shadow.append(link);
		}
	}
}
