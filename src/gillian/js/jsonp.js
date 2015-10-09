/* eslint-env browser */
let counter = 0;
let head;

const callbackName = 'callback';

function load(url, pfnError) {
	const script = document.createElement('script');
	let done = false;

	script.src = url;
	script.async = true;

	let errorHandler = pfnError;
	if (typeof errorHandler === 'function') {
		script.onerror = ex => {
			errorHandler({
				url: url,
				event: ex
			});
		};
	}

	script.onload = script.onreadystatechange = () => {
		if (!done && (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete')) {
			done = true;
			script.onload = script.onreadystatechange = null;
			if (script && script.parentNode) {
				script.parentNode.removeChild(script);
			}
		}
	};

	if (!head) {
		head = document.getElementsByTagName('head')[0];
	}
	head.appendChild(script);
}

let JSONP = {
	get: (url, params) => {
		let query = (url || '').indexOf('?') === -1 ? '?' : '&';
		let uniqueName = callbackName + '_json' + (++counter);

		params = params || {};

		for (let key in params) {
			if (params.hasOwnProperty(key)) {
				query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
			}
		}

		return new Promise((resolve, reject) => {
			load(url + query + callbackName + '=' + uniqueName, reject);

			window[uniqueName] = data => {
				resolve(data);
				try {
					delete window[uniqueName];
				} catch (e) {}
				window[uniqueName] = null;
			};
		});
	}
};

export default JSONP;
