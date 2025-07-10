/* eslint-disable @typescript-eslint/naming-convention */

import { env, createExecutionContext, fetchMock, waitOnExecutionContext } from "cloudflare:test";
import { afterEach, beforeAll, describe, expect, test } from "vitest";
import app from "../src/index.tsx";

const sixtyDays = 60 * 60 * 60 * 24;

beforeAll(() => {
	fetchMock.activate();
	fetchMock.disableNetConnect();
});

afterEach(() => {
	fetchMock.assertNoPendingInterceptors();
});

describe("Instagram Basic Worker", () => {
	test("it redirects to authorize the user", async () => {
		const context = createExecutionContext();
		const response = await app.request("http://example.com", {}, env, context);
		await waitOnExecutionContext(context);

		expect(response.status).toStrictEqual(302);
		expect(response.headers.get("location")).toStrictEqual(
			"https://api.instagram.com/oauth/authorize?redirect_uri=http%3A%2F%2Fexample.com%2F&scope=user_profile%2Cuser_media&response_type=code&client_id=client-id",
		);
	});

	test("it authorizes the user", async () => {
		const now = Date.now();

		const apiScope = fetchMock.get("https://api.instagram.com");
		const graphScope = fetchMock.get("https://graph.instagram.com");

		apiScope
			.intercept({
				path: "/oauth/access_token",
				method: "POST",
				body: new URLSearchParams({
					redirect_uri: "http://example.com/",
					code: "foo",
					grant_type: "authorization_code",
					client_id: "client-id",
					client_secret: "client-secret",
				}).toString(),
			})
			.reply(200, {
				access_token: "short-lived-access-token",
				expires_in: (now + sixtyDays) / 1000,
				token_type: "bearer",
			});

		graphScope
			.intercept({
				path: "/access_token",
				method: "GET",
				query: {
					access_token: "short-lived-access-token",
					grant_type: "ig_exchange_token",
					client_secret: "client-secret",
				},
			})
			.reply(200, {
				access_token: "long-lived-user-access-token",
				token_type: "bearer",
				expires_in: (now + sixtyDays) / 1000,
			});

		graphScope
			.intercept({
				path: "/me",
				query: {
					fields: "id,username",
					access_token: "long-lived-user-access-token",
				},
				method: "GET",
			})
			.reply(200, {
				id: 123,
				username: "my-username",
			});

		const context = createExecutionContext();
		const response = await app.request("http://example.com?code=foo", {}, env, context);
		await waitOnExecutionContext(context);

		expect(response.status).toStrictEqual(200);

		const config = await env.GRAPH_CONFIG.get("MY-USERNAME", "json");

		expect(config).toStrictEqual({
			accessToken: "long-lived-user-access-token",
			expiresIn: expect.any(Number) as number,
			id: 123,
			username: "my-username",
			updatedAt: expect.any(Number) as number,
		});
	});

	test("returns the media for a username", async () => {
		const now = Date.now();

		await env.GRAPH_CONFIG.put(
			"MY-USERNAME",
			JSON.stringify({
				accessToken: "long-lived-user-access-token",
				expiresOn: (now + sixtyDays) / 1000,
				id: 123,
				updatedAt: now,
				username: "my-username",
			}),
		);

		const graphScope = fetchMock.get("https://graph.instagram.com");

		graphScope
			.intercept({
				path: "/me/media",
				query: {
					fields: "id,username,media_url,timestamp,media_type,thumbnail_url,caption,permalink",
					access_token: "long-lived-user-access-token",
					limit: 15,
				},
				method: "GET",
			})
			.reply(200, {
				data: [
					{
						id: "123",
						caption: "abc",
					},
					{
						id: "456",
						caption: "def",
					},
					{
						id: "789",
						caption: "hij",
					},
				],
				paging: {
					cursors: {},
					next: "next",
				},
			});

		graphScope
			.intercept({
				path: "/refresh_access_token",
				method: "GET",
				query: {
					access_token: "long-lived-user-access-token",
					grant_type: "ig_refresh_token",
				},
			})
			.reply(200, {
				access_token: "another-long-lived-user-access-token",
				token_type: "bearer",
				expires_in: (now + sixtyDays) / 1000,
			});

		const context = createExecutionContext();
		const response = await app.request("http://example.com/my-username", {}, env, context);
		await waitOnExecutionContext(context);

		expect(response.status).toStrictEqual(200);
		const mediaJson = await response.json<unknown>();

		expect(mediaJson).toStrictEqual({
			data: [
				{
					caption: "abc",
					id: "123",
				},
				{
					caption: "def",
					id: "456",
				},
				{
					caption: "hij",
					id: "789",
				},
			],
		});

		const cachedResult = await caches.default.match(new Request("http://example.com/my-username"));
		const cachedJson = await cachedResult?.json();
		expect(cachedJson).toStrictEqual(mediaJson);
	});
});
