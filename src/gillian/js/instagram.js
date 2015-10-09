/* eslint-env browser */
/* eslint camelcase: [2, {properties: "never"}] */

import JSONP from './jsonp';

const config = {
	// Instagram Access Data
	max: 10,
	query: 'coffee',
	size: 'medium',
	wrapEachWith: 'li',
	complete: null
};

class Instagram {
	static initialise(conf) {
		Instagram.accessToken = conf.accessToken;
		Instagram.clientID = conf.clientID;
	}

	constructor(options, $element) {
		if (!Instagram.accessToken || !Instagram.clientID) {
			throw new Error('You must define an accessToken and a clientID');
		}

		let self = this;
		self.api = 'https://api.instagram.com/v1';
		self.accessToken = Instagram.accessToken;
		self.clientID = Instagram.clientID;
		self.$elem = $element;
		self.options = Object.assign({}, config, options);
	}

	// Users
	// Get the most recent media published by a user.
	recentMedia(userID) {
		let self = this;
		let url = `/users/${userID}/media/recent/`;
		let params = {
			client_id: self.clientID,
			access_token: self.accessToken
		};

		self
			.fetch(url, params)
			.then(self.display.bind(self));
	}

	// Search for a user by name.
	userFeed() {
		let self = this;
		let url = '/users/search';
		let params = {
			q: self.options.query,
			count: self.options.max,
			access_token: self.accessToken
		};

		self
			.fetch(url, params)
			.then(results => {
				if (results.data.length) {
					self.recentMedia(results.data[0].id);
				} else {
					throw new Error(`Error: the username ${self.options.query} does not exist.`);
				}
			});
	}

	// Media
	// Get a list of what media is most popular at the moment
	popular() {
		let self = this;
		let url = '/media/popular';
		let params = {
			client_id: self.clientID,
			access_token: self.accessToken
		};

		self.fetch(url, params).then(self.display);
	}

	// Tags
	// Get a list of recently tagged media
	recentTagged() {
		let self = this;
		let url = `/tags/${self.options.query}/media/recent`;
		let params = {
			client_id: self.clientID,
			access_token: self.accessToken
		};

		self.fetch(url, params).then(results => {
			if (results.data.length) {
				self.display(results);
			} else {
				throw new Error(`Error: the tag ${self.options.query} does not have results.`);
			}
		});
	}

	fetch(url, params) {
		let self = this;
		let getUrl = self.api + url;

		return JSONP.get(getUrl, params);
	}

	display(results) {
		let self = this;
		let setSize = self.options.size;
		let size;
		let max = (self.options.max >= results.data.length) ? results.data.length : self.options.max;

		if (results.data.length === 0) {
			let list = document.createElement(self.options.wrapEachWith);
			list.appendChild(self.options.notFoundMsg);
			self.$elem.appendChild(list);
		} else {
			for (var i = 0; i < max; i++) {
				if (setSize === 'small') {
					size = results.data[i].images.thumbnail.url;
				} else if (setSize === 'medium') {
					size = results.data[i].images.low_resolution.url;
				} else {
					size = results.data[i].images.standard_resolution.url;
				}

				var titleIMG;
				// Skip if the caption is empty.
				if (results.data[i].caption !== null) {
					/**
					 * 1. First it creates a dummy element <span/>
					 * 2. And then puts the caption inside the element created previously.
					 * 3. Extracts the html caption (this allows html codes to be included).
					 * 4. Lastly, the most important part, create the Title attribute using double quotes
					 * to enclose the text. This fixes the bug when the caption retrieved from Instagram
					 * includes single quotes which breaks the Title attribute.
					 */
					let span = document.createElement('span');
					span.textContent = results.data[i].caption.text;
					titleIMG = span.innerHTML;
				}

				// Now concatenate the titleIMG generated.
				let image = document.createElement('a');
				image.title = titleIMG;
				image.target = '_blank';
				image.href = results.data[i].link;
				image.innerHTML = `<img src='${size}'></img>`;
				let list = document.createElement(self.options.wrapEachWith);
				list.appendChild(image);
				self.$elem.appendChild(list);
			}
		}

		if (typeof self.options.complete === 'function') {
			self.options.complete.call(self);
		}
	}
}

export default Instagram;
