import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {},
		colors: {
			background: "var(--bg)",
			foreground: "var(--fg)",
			foregroundMuted: "var(--fg-muted)",
		},
	},

	plugins: [],
} satisfies Config;
