import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			src: path.resolve(__dirname, "./src"),
		},
	},
	test: {
		testTimeout: 30000,
	},
});
