/* eslint-disable @typescript-eslint/naming-convention */

import anyTest, {type TestFn} from 'ava';
import {fetch, MockAgent, setGlobalDispatcher, type RequestInfo, type RequestInit} from 'undici';
import {Miniflare, Request} from 'miniflare';

type Context = {
	mf: Miniflare;
};

const sixtyDays = 60 * 60 * 60 * 24;

const test = anyTest as TestFn<Context>;

const mockAgent = new MockAgent({
	keepAliveTimeout: 10,
	keepAliveMaxTimeout: 10,
});

mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

test.beforeEach(async (t) => {
	const url = new URL('../dist/index.js', import.meta.url);

	const mf = new Miniflare({
		envPath: true,
		bindings: {
			INSTAGRAM_CLIENT_ID: 'client-id',
			INSTAGRAM_CLIENT_SECRET: 'client-secret',
		},
		kvNamespaces: ['GRAPH_CONFIG'],
		packagePath: true,
		wranglerConfigPath: true,
		buildCommand: undefined,
		scriptPath: url.pathname,
		modules: true,
		globals: {
			async fetch(request: RequestInfo, init?: RequestInit) {
				return fetch(request, {
					...init,
					dispatcher: mockAgent,
				});
			},
		},
	});

	t.context = {mf};
});

test.afterEach(async (t) => {
	await t.context.mf.dispose();
});

test('it redirects to authorize the user', async (t) => {
	const {mf} = t.context;
	const response = await mf.dispatchFetch('http://example.com');

	t.is(response.status, 302);
	t.is(
		response.headers.get('location'),
		'https://api.instagram.com/oauth/authorize?client_id=client-id&scope=user_profile%2Cuser_media&response_type=code&redirect_uri=http%3A%2F%2Fexample.com%2F',
	);
});

test('it authorizes the user', async (t) => {
	const apiScope = mockAgent.get('https://api.instagram.com');
	const graphScope = mockAgent.get('https://graph.instagram.com');

	apiScope
		.intercept({
			path: '/oauth/access_token',
			method: 'POST',
			body(body) {
				const parameters = new URLSearchParams(body);
				return t.deepEqual(
					{
						clientId: parameters.get('client_id'),
						clientSecret: parameters.get('client_secret'),
						grantType: parameters.get('grant_type'),
						redirectUri: parameters.get('redirect_uri'),
						code: parameters.get('code'),
					},
					{
						clientId: 'client-id',
						clientSecret: 'client-secret',
						grantType: 'authorization_code',
						redirectUri: 'http://example.com/',
						code: 'foo',
					},
				);
			},
		})
		.reply(200, {
			access_token: 'short-lived-access-token',
		});

	graphScope
		.intercept({
			path: '/access_token',
			method: 'GET',
			query: {
				grant_type: 'ig_exchange_token',
				client_secret: 'client-secret',
				access_token: 'short-lived-access-token',
			},
		})
		.reply(200, {
			access_token: 'long-lived-user-access-token',
			token_type: 'bearer',
			expires_in: Date.now() + sixtyDays,
		});

	graphScope
		.intercept({
			path: '/me',
			query: {
				fields: 'id,username',
				access_token: 'long-lived-user-access-token',
			},
			method: 'GET',
		})
		.reply(200, {
			id: 123,
			username: 'my-username',
		});

	const {mf} = t.context;
	const response = await mf.dispatchFetch('http://example.com?code=foo');

	t.is(response.status, 200);

	const ns = await mf.getKVNamespace('GRAPH_CONFIG');
	const config = await ns.get('MY-USERNAME');

	if (typeof config === 'string') {
		t.like(JSON.parse(config), {
			accessToken: 'long-lived-user-access-token',
			id: 123,
			username: 'my-username',
		});
	} else {
		t.fail('config is null');
	}
});

test('returns the media for a username', async (t) => {
	const now = Date.now();

	const {mf} = t.context;
	const caches = await mf.getCaches();

	const ns = await mf.getKVNamespace('GRAPH_CONFIG');
	await ns.put(
		'MY-USERNAME',
		JSON.stringify({
			accessToken: 'long-lived-user-access-token',
			expiresOn: now + sixtyDays,
			id: 123,
			updatedAt: now,
			username: 'my-username',
		}),
	);

	const graphScope = mockAgent.get('https://graph.instagram.com');

	graphScope
		.intercept({
			path: '/me/media',
			query: {
				fields: 'id,username,media_url,timestamp,media_type,thumbnail_url,caption,permalink',
				access_token: 'long-lived-user-access-token',
				limit: 15,
			},
			method: 'GET',
		})
		.reply(200, {
			data: [
				{
					id: '123',
					caption: 'abc',
				},
				{
					id: '456',
					caption: 'def',
				},
				{
					id: '789',
					caption: 'hij',
				},
			],
			paging: {
				cursors: {},
				next: 'next',
			},
		});

	graphScope
		.intercept({
			path: '/refresh_access_token',
			method: 'GET',
			query: {
				grant_type: 'ig_refresh_token',
				access_token: 'long-lived-user-access-token',
			},
		})
		.reply(200, {
			access_token: 'another-long-lived-user-access-token',
			token_type: 'bearer',
			expires_in: now + sixtyDays,
		});

	const response = await mf.dispatchFetch('http://example.com/my-username');
	await response.waitUntil();

	t.is(response.status, 200);
	const mediaJson = await response.json();

	t.like(mediaJson, {
		data: [
			{
				caption: 'abc',
				id: '123',
			},
			{
				caption: 'def',
				id: '456',
			},
			{
				caption: 'hij',
				id: '789',
			},
		],
	});

	const cachedResult = await caches.default.match(new Request('http://example.com/my-username'));
	const cachedJson = await cachedResult?.json();
	t.deepEqual(cachedJson, mediaJson);
});
