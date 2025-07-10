import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(async ({ children }) => (
	<html>
		<head>
			<title>Insagram Graph</title>
			{html`
				<script>
					history.replaceState({}, document.title, "/");
				</script>
			`}
		</head>
		<body>${children}</body>
	</html>
));

type SuccessProps = {
	username: string;
	profileUrl: URL;
};

export async function SuccessView({ username, profileUrl }: SuccessProps) {
	return (
		<>
			<h1>Looks good!</h1>
			<p>
				Your media endpoint is ready to be used and can be accessed through
				<a href={`/${username}`}>{profileUrl.toString()}</a>!
			</p>
		</>
	);
}

export async function ErrorView() {
	return (
		<>
			<h1>Uh oh! Something went wrong..</h1>
			<p>Please try again later</p>
		</>
	);
}
