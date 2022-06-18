/* eslint-env browser */

import ky from 'ky';
import Lazy from 'p-lazy';

const blogData = new Map();

const ghostApi = ky.create({
	prefixUrl: 'https://gilly-reads.ghost.io/ghost/api/v3/content',
	searchParams: {
		key: 'c2bf893ce67fc9f7aaa96d0848',
		limit: 'all',
		include: 'tags',
		formats: ['plaintext'],
	},
});

const loadIndex = Lazy.from(() =>
	Promise.all([import('lunr'), import('leven'), ghostApi.get('posts').json()]).then((result) => {
		const [{default: lunr}, {default: leven}, {posts}] = result;

		const index = lunr(function () {
			this.ref('id');
			this.field('title');
			this.field('description');
			this.field('plaintext');
			this.field('pubDate');
			this.field('tag');

			for (const post of posts) {
				const parsedData = {
					id: String(post.id),
					title: String(post.title),
					description: String(post.custom_excerpt),
					publishedDate: String(post.published_at),
					tag: post.tags?.map(({name}) => name).join(', ') ?? 'undefined',
				};

				this.add(parsedData);

				blogData.set(post.id, {
					title: post.title,
					description: post.custom_excerpt,
					publishedDate: formatDate(parsedData.publishedDate),
					url: post.url,
				});
			}
		});

		return {index, lunr, leven};
	}),
);

export function setupSearch(selector) {
	const searchForm = document.querySelector(selector);
	const searchResults = document.querySelector('[data-search-results]');

	const {search: searchField} = searchForm.elements;

	searchField.addEventListener('input', (event) => handleSearch(event, searchResults));
	searchForm.addEventListener('submit', (event) => event.preventDefault());
}

async function handleSearch(event, searchResults) {
	loadIndex.then((index) => {
		const {value} = event.target;
		const results = queryIndex(index, value.toLocaleLowerCase().split(/\s+/));
		const entries = Array.from(results, (result) => blogData.get(result.ref)).slice(0, 15);

		const htmlEntries = renderEntries(entries);

		searchResults.replaceChildren(...htmlEntries);
	});
}

function queryIndex({index, lunr}, terms) {
	const searchResults = new Map();
	const otherResults = new Map();

	for (const [termIndex, term] of terms.entries()) {
		const results = index.query((query) => {
			query.term(term, {
				usePipeline: true,
				boost: 100,
			});
			query.term(term, {
				usePipeline: false,
				boost: 10,
				wildcard: lunr.Query.wildcard.TRAILING,
			});
			query.term(term, {
				usePipeline: false,
				editDistance: 1,
				boost: 1,
			});
		});

		for (const result of results) {
			if (termIndex === 0) {
				searchResults.set(result.ref, result);
			} else {
				otherResults.set(result.ref);
			}
		}
	}

	if (otherResults.size > 0) {
		for (const [ref] of searchResults) {
			if (!otherResults.has(ref)) {
				searchResults.delete(ref);
			}
		}
	}

	return searchResults.values();
}

function renderEntries(entries) {
	const htmlEntries = [];

	for (const entry of entries) {
		const item = document.createElement('li');
		item.classList.add('relative', 'p-4', 'bg-white', 'rounded-lg');

		const container = document.createElement('div');
		container.classList.add('prose');

		const titleLink = document.createElement('a');
		titleLink.setAttribute('href', entry.url);
		titleLink.classList.add('search-link');

		const title = document.createElement('h3');
		titleLink.append(entry.title);

		const description = document.createElement('p');
		description.append(entry.description);

		const publishedDate = document.createElement('p');
		publishedDate.append(`Published date: ${entry.publishedDate}`);
		publishedDate.classList.add('text-right');

		title.append(titleLink);
		container.append(title);

		if (entry.description) {
			container.append(description);
		}

		container.append(publishedDate);
		item.append(container);

		htmlEntries.push(item);
	}

	return htmlEntries;
}

const longDate = new Intl.DateTimeFormat('en', {dateStyle: 'long'});

function formatDate(dateString) {
	return longDate.format(new Date(dateString));
}
