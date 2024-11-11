import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {
			colors: {
				background: "var(--bg)",
				foreground: "var(--fg)",
				"foreground-muted": "var(--fg-muted)",
				"foreground-muted-alt": "var(--fg-muted-alt)",
			},
			fontFamily: {
				display: "var(--font-display)",
				body: "var(--font-body)",
			},
		},
	},

	plugins: [],
} satisfies Config;
