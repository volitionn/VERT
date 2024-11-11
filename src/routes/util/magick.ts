import { initializeImageMagick } from "@imagemagick/magick-wasm";

export let initialized = false;

export const init = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) => {
	if (initialized) return;
	const wasmBytes = await fetch("/magick.wasm").then((res) =>
		res.arrayBuffer(),
	);
	await initializeImageMagick(wasmBytes);
	initialized = true;
};
