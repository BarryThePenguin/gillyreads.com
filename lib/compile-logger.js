import log from "fancy-log";
import PluginError from "plugin-error";

export function compileLogger(error, stats) {
	if (error) {
		throw new PluginError("webpack", error);
	}

	log(
		"[webpack:build]",
		stats.toString({
			colors: true,
		})
	);
}
