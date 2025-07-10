/* eslint-disable @typescript-eslint/naming-convention */

import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as client from "openid-client";
import { ErrorView, renderer, SuccessView } from "./views.tsx";

type InstagramProfile = {
	id: string;
	username: string;
};

type InstagramMedia = {
	paging: unknown;
	data: Array<{
		id: string;
		username: string;
		media_url: string;
		timestamp: number;
		media_type: string;
		thumbnail_url: string;
		caption: string;
		permalink: string;
	}>;
};

type UserProfile = {
	id: string;
	username: string;
	accessToken: string;
	expiresIn: number;
	updatedAt: number;
};

type Variables = {
	auth: {
		authorize: () => Promise<Response>;
		fetchMedia: (options: { username: string; count: number }) => Promise<Response>;
	};
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use(renderer);
app.use(auth());

app.get("/", async (c) => c.var.auth.authorize());

app.get("/:username", async (c) => {
	const count = Number(c.req.query("count") ?? 15);
	const username = c.req.param("username");
	return c.var.auth.fetchMedia({ username, count });
});

export default app;

function auth() {
	return createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
		const instagramGraph = new InstagramGraph(c.env.INSTAGRAM_CLIENT_SECRET);
		const instagramApi = new InstagramApi(instagramGraph, c.env.INSTAGRAM_CLIENT_ID, c.env.INSTAGRAM_CLIENT_SECRET);

		c.set("auth", {
			async authorize() {
				const { origin, searchParams } = new URL(c.req.url);
				const code = searchParams.get("code");

				try {
					if (typeof code === "string") {
						const profile = await instagramApi.authorize(c.req.raw);

						c.executionCtx.waitUntil(
							setProfile({
								...profile,
								updatedAt: Date.now(),
							}),
						);

						const profileUrl = new URL(profile.username, origin);
						return await c.render(<SuccessView profileUrl={profileUrl} username={profile.username} />);
					}
				} catch (error: unknown) {
					console.error(error);
					return c.render(<ErrorView />);
				}

				const authorizeUrl = instagramApi.buildAuthorizeUrl({
					redirect_uri: new URL("/", origin).toString(),
					scope: "user_profile,user_media",
				});

				return c.redirect(authorizeUrl.toString());
			},

			async fetchMedia({ username, count }) {
				let response;
				const profile = await getProfile(username);

				if (profile) {
					response = await getCachedMedia(c.req.raw, profile, count);
				}

				if (!response) {
					throw new HTTPException(404, {
						res: c.text(`Could not find ${username}`, 404),
					});
				}

				return response;
			},
		});

		async function getCachedMedia(cacheKey: Request, profile: UserProfile, count: number) {
			let response = await caches.default.match(cacheKey);

			if (!response) {
				const media = await instagramGraph.fetchMedia(profile.accessToken, count);

				response = Response.json(media, {
					headers: {
						"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=30",
					},
				});

				c.executionCtx.waitUntil(caches.default.put(cacheKey, response.clone()));
				c.executionCtx.waitUntil(refreshUserProfile(profile));
			}

			return response;
		}

		async function refreshUserProfile(profile: UserProfile) {
			const longLivedToken = await instagramGraph.refreshAccessToken(profile.accessToken);

			await setProfile({
				...profile,
				...longLivedToken,
			});
		}

		await next();
	});
}

class InstagramApi {
	host = "https://api.instagram.com/";

	config: client.Configuration;

	graphClient: InstagramGraph;

	constructor(graphClient: InstagramGraph, clientId: string, clientSecret: string) {
		this.graphClient = graphClient;

		this.config = new client.Configuration(
			{
				issuer: "https://api.instagram.com",
				authorization_endpoint: "https://api.instagram.com/oauth/authorize",
				token_endpoint: "https://api.instagram.com/oauth/access_token",
			},
			clientId,
			clientSecret,
		);
	}

	async authorize(currentUrl: Request | URL) {
		const tokens = await client.authorizationCodeGrant(this.config, currentUrl);
		const longLivedTokens = await this.graphClient.exchangeAccessToken(tokens.access_token);
		const userProfile = await this.graphClient.getUserProfile(longLivedTokens.access_token);

		const expiresIn = tokens.expiresIn();

		if (typeof expiresIn === "number") {
			return { ...userProfile, accessToken: longLivedTokens.access_token, expiresIn };
		}

		throw new HTTPException(400, {
			res: new Response("Failed to fetch user profile", { status: 400 }),
		});
	}

	buildAuthorizeUrl(parameters: URLSearchParams | Record<string, string>) {
		return client.buildAuthorizationUrl(this.config, {
			...parameters,
			response_type: "code",
		});
	}
}

class InstagramGraph {
	readonly accessTokenUrl: URL;
	readonly meUrl: URL;
	readonly myMediaUrl: URL;
	readonly refreshTokenUrl: URL;

	constructor(clientSecret: string) {
		const issuer = "https://graph.instagram.com/";
		this.accessTokenUrl = new URL("access_token", issuer);
		this.accessTokenUrl.searchParams.set("grant_type", "ig_exchange_token");
		this.accessTokenUrl.searchParams.set("client_secret", clientSecret);

		this.refreshTokenUrl = new URL("refresh_access_token", issuer);
		this.refreshTokenUrl.searchParams.set("grant_type", "ig_refresh_token");

		this.meUrl = new URL("me", issuer);
		this.meUrl.searchParams.set("fields", "id,username");

		this.myMediaUrl = new URL("me/media", issuer);
		this.myMediaUrl.searchParams.set(
			"fields",
			"id,username,media_url,timestamp,media_type,thumbnail_url,caption,permalink",
		);
	}

	async exchangeAccessToken(accessToken: string) {
		this.accessTokenUrl.searchParams.set("access_token", accessToken);
		const response = await fetch(this.accessTokenUrl);
		const tokens = await response.json<client.TokenEndpointResponse>();
		return tokens;
	}

	async refreshAccessToken(accessToken: string) {
		this.refreshTokenUrl.searchParams.set("access_token", accessToken);
		const response = await fetch(this.refreshTokenUrl);
		const tokens = await response.json<client.TokenEndpointResponse>();

		const expiresIn = tokens.expires_in;

		if (typeof expiresIn === "number") {
			return { accessToken: tokens.access_token, expiresIn };
		}

		throw new HTTPException(400, {
			res: new Response("Failed to refresh access token", { status: 400 }),
		});
	}

	async getUserProfile(accessToken: string) {
		this.meUrl.searchParams.set("access_token", accessToken);
		const response = await fetch(this.meUrl);
		return response.json<InstagramProfile>();
	}

	async fetchMedia(accessToken: string, count: number) {
		const limit = Math.min(count, 100);
		this.myMediaUrl.searchParams.set("access_token", accessToken);
		this.myMediaUrl.searchParams.set("limit", limit.toFixed(0));
		const response = await fetch(this.myMediaUrl);
		const { data } = await response.json<InstagramMedia>();
		return { data };
	}
}

async function setProfile(profile: UserProfile) {
	const key = profile.username.toUpperCase();
	await env.GRAPH_CONFIG.put(key, JSON.stringify(profile), { expirationTtl: profile.expiresIn });
}

async function getProfile(username?: string) {
	const key = username?.toUpperCase();
	let profile;

	if (key) {
		profile = await env.GRAPH_CONFIG.get<UserProfile>(key, "json");
	}

	return profile;
}
