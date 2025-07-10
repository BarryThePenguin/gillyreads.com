import globals from "globals";
import { type FlatXoConfig } from "xo";

const xoConfig: FlatXoConfig = [
	{
		languageOptions: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			globals: {
				...globals.browser,
			},
		},
		prettier: "compat",
		rules: {
			"@typescript-eslint/parameter-properties": "off",
		},
	},
];

export default xoConfig;
