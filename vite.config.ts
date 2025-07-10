import { defineConfig } from "vite";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
	build: {
		emitAssets: true,
		emptyOutDir: false,
		lib: {
			entry: "src/index.js",
			fileName: "assets/main",
			formats: ["es"],
		},
		outDir: "content/themes/gillian",
		// RollupOptions: {
		// 	input: {
		// 		main: "src/index.js",
		// 	},
		// 	output: {
		// 		dir: "content/themes/gillian",
		// 		assetFileNames: "assets/[name][extname]",
		// 		entryFileNames: "assets/[name].js",
		// 	},
		// },
	},
});
