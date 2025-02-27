import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "src/components"),
			"@utils": path.resolve(__dirname, "src/utils"),
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
				timer: "public/timer.html",
				worldClock: "public/world-clock.html",
			},
		},
	},
});
