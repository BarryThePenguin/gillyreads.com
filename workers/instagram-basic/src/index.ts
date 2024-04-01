export type Env = {
	INSTAGRAM_CLIENT_ID: string;

	INSTAGRAM_CLIENT_SECRET: string;

	GRAPH_CONFIG: KVNamespace;
};

type ShortLivedAccessToken = {
	access_token: string;
	user_id: number;
};

type LongLivedAccessToken = {
	access_token: string;
	token_type: string;
	expires_in: number;
};

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

const mediaRoute = /\/.+/;

const profiles = new Map<string, UserProfile>();

const handler: ExportedHandler<Env> = {
	async fetch(request, env, context) {
		const { pathname } = new URL(request.url);
		const controller = new Controller(env, context);

		if (mediaRoute.test(pathname)) {
			return controller.fetchMedia(request);
		}

		return controller.authorize(request);
	},
};

export default handler;

class Base {
	notFound(message?: string) {
		return Response.json({ status: "error", message: message ?? "Not found" }, { status: 404 });
	}

	render(view: View) {
		const html = render(new Layout(view));

		return new Response(html, { headers: { "Content-Type": "text/html" } });
	}
}

class Controller extends Base {
	instagramApi: InstagramApi;

	instagramGraph: InstagramGraph;

	constructor(
		readonly env: Env,
		readonly context: ExecutionContext
	) {
		super();

		this.instagramGraph = new InstagramGraph(env.INSTAGRAM_CLIENT_SECRET);
		this.instagramApi = new InstagramApi(
			this.instagramGraph,
			this.env.INSTAGRAM_CLIENT_ID,
			this.env.INSTAGRAM_CLIENT_SECRET
		);
	}

	async authorize(request: Request) {
		const { origin, searchParams } = new URL(request.url);
		const code = searchParams.get("code");

		try {
			if (typeof code === "string") {
				const redirectUri = new URL("/", origin);
				const profile = await this.instagramApi.authorize(code, redirectUri);

				await setProfile(this.env.GRAPH_CONFIG, {
					...profile,
					updatedAt: Date.now(),
				});

				const profileUrl = new URL(profile.username, origin);
				return this.render(new SuccessView(profile.username, profileUrl));
			}
		} catch (error: unknown) {
			console.error(error);
			return this.render(new ErrorView());
		}

		const { authorizeUrl } = this.instagramApi;
		const redirectUri = new URL("/", origin);
		authorizeUrl.searchParams.set("redirect_uri", redirectUri.toString());
		return Response.redirect(authorizeUrl.toString());
	}

	async fetchMedia(request: Request) {
		const { pathname, searchParams } = new URL(request.url);
		const [username] = pathname.replace(/^\//, "").split("/");
		const count = Number(searchParams.get("count") ?? 15);

		let response;
		const profile = await getProfile(this.env.GRAPH_CONFIG, username);

		if (profile) {
			const cacheUrl = new URL(request.url);
			const cacheKey = new Request(cacheUrl.toString(), request);
			response = await this.getCachedMedia(cacheKey, profile, count);
		}

		if (response) {
			return response;
		}

		return this.notFound(`Could not find ${username}`);
	}

	async getCachedMedia(cacheKey: Request, profile: UserProfile, count: number) {
		const cache = caches.default;
		let response = await cache.match(cacheKey);

		if (!response) {
			const media = await this.instagramGraph.fetchMedia(profile.accessToken, count);

			response = Response.json(media, {
				headers: {
					"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=30",
				},
			});

			this.context.waitUntil(cache.put(cacheKey, response.clone()));
			this.context.waitUntil(this.refreshUserProfile(profile));
		}

		return response;
	}

	async refreshUserProfile(profile: UserProfile) {
		const longLivedToken = await this.instagramGraph.refreshAccessToken(profile.accessToken);

		await setProfile(this.env.GRAPH_CONFIG, {
			...profile,
			...longLivedToken,
		});
	}
}

class InstagramApi {
	host = "https://api.instagram.com/";

	authorizeUrl: URL;

	accessTokenUrl: URL;

	constructor(
		readonly graphClient: InstagramGraph,
		readonly clientId: string,
		readonly clientSecret: string
	) {
		this.authorizeUrl = new URL("oauth/authorize", this.host);
		this.authorizeUrl.searchParams.set("client_id", clientId);
		this.authorizeUrl.searchParams.set("scope", "user_profile,user_media");
		this.authorizeUrl.searchParams.set("response_type", "code");

		this.accessTokenUrl = new URL("oauth/access_token", this.host);
	}

	async authorize(code: string, redirectUri: URL) {
		const accessToken = await this.getAccessToken(code, redirectUri);
		const longLivedToken = await this.graphClient.exchangeAccessToken(accessToken);
		const userProfile = await this.graphClient.getUserProfile(longLivedToken.accessToken);

		return { ...longLivedToken, ...userProfile };
	}

	async getAccessToken(code: string, redirectUri: URL) {
		const accessTokenBody = new URLSearchParams({ code });
		accessTokenBody.set("client_id", this.clientId);
		accessTokenBody.set("client_secret", this.clientSecret);
		accessTokenBody.set("grant_type", "authorization_code");
		accessTokenBody.set("redirect_uri", redirectUri.toString());

		const response = await fetch(this.accessTokenUrl.toString(), {
			method: "post",
			body: accessTokenBody,
		});

		const responseJson = await response.json<ShortLivedAccessToken>();
		return responseJson.access_token;
	}
}

class InstagramGraph {
	host = "https://graph.instagram.com/";

	refreshTokenUrl: URL;
	accessTokenUrl: URL;
	meUrl: URL;
	myMediaUrl: URL;

	constructor(readonly clientSecret: string) {
		this.refreshTokenUrl = new URL("refresh_access_token", this.host);
		this.refreshTokenUrl.searchParams.set("grant_type", "ig_refresh_token");

		this.accessTokenUrl = new URL("access_token", this.host);
		this.accessTokenUrl.searchParams.set("grant_type", "ig_exchange_token");
		this.accessTokenUrl.searchParams.set("client_secret", this.clientSecret);

		this.meUrl = new URL("me", this.host);
		this.meUrl.searchParams.set("fields", "id,username");

		this.myMediaUrl = new URL("me/media", this.host);
		this.myMediaUrl.searchParams.set(
			"fields",
			"id,username,media_url,timestamp,media_type,thumbnail_url,caption,permalink"
		);
	}

	async exchangeAccessToken(accessToken: string) {
		const { accessTokenUrl } = this;
		accessTokenUrl.searchParams.set("access_token", accessToken);
		const response = await fetch(accessTokenUrl.toString());
		const responseJson = await response.json<LongLivedAccessToken>();
		return {
			accessToken: responseJson.access_token,
			expiresIn: responseJson.expires_in,
		};
	}

	async refreshAccessToken(accessToken: string) {
		const { refreshTokenUrl } = this;
		refreshTokenUrl.searchParams.set("access_token", accessToken);
		const response = await fetch(refreshTokenUrl.toString());
		const responseJson = await response.json<LongLivedAccessToken>();
		return {
			accessToken: responseJson.access_token,
			expiresIn: responseJson.expires_in,
		};
	}

	async getUserProfile(accessToken: string) {
		const { meUrl } = this;
		meUrl.searchParams.set("access_token", accessToken);
		const response = await fetch(meUrl.toString());
		return response.json<InstagramProfile>();
	}

	async fetchMedia(accessToken: string, count: number) {
		const limit = Math.min(count, 100);
		const { myMediaUrl } = this;
		myMediaUrl.searchParams.set("access_token", accessToken);
		myMediaUrl.searchParams.set("limit", limit.toFixed(0));

		const response = await fetch(myMediaUrl.toString());
		const { data } = await response.json<InstagramMedia>();

		return { data };
	}
}

async function setProfile(config: KVNamespace, profile: UserProfile) {
	const key = profile.username.toUpperCase();
	profiles.set(key, profile);

	await config.put(key, JSON.stringify(profile), { expirationTtl: profile.expiresIn });
}

async function getProfile(config: KVNamespace, username: string) {
	const key = username.toUpperCase();
	let profile = profiles.get(key);

	if (!profile) {
		const json = await config.get(key);
		if (typeof json === "string") {
			profile = JSON.parse(json) as UserProfile;
		}
	}

	return profile;
}

type TemplateResult = {
	strings: TemplateStringsArray;
	values: Array<TemplateResult | string>;
};

function html(strings: TemplateStringsArray, ...values: Array<TemplateResult | string>): TemplateResult {
	return {
		strings,
		values,
	};
}

type View = {
	render(): TemplateResult;
};

class Layout implements View {
	constructor(readonly content: View) {}

	render() {
		return html`
			<html>
				<head>
					<title>Insagram Graph</title>
					<script>
						history.replaceState({}, document.title, "/");
					</script>
				</head>
				<body>
					${this.content.render()}
				</body>
			</html>
		`;
	}
}

class SuccessView implements View {
	constructor(
		readonly username: string,
		readonly profileUrl: URL
	) {}

	render() {
		return html`
			<h1>Looks good!</h1>
			<p>
				Your media endpoint is ready to be used and can be accessed through
				<a href="/${this.username}">${this.profileUrl.toString()}</a>!
			</p>
		`;
	}
}

class ErrorView implements View {
	render() {
		return html`
			<h1>Uh oh! Something went wrong..</h1>
			<p>Please try again later</p>
		`;
	}
}

function interpolateTemplate({ strings, values }: TemplateResult) {
	let result = "";

	for (const [index, raw] of strings.raw.entries()) {
		result += raw;

		if (index < values.length) {
			const value = values[index];

			result += typeof value === "string" ? value : interpolateTemplate(value);
		}
	}

	return result;
}

function render(view: View) {
	return interpolateTemplate(view.render());
}
