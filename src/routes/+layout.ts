import { browser } from "$app/environment";
import VipsWorker from "$lib/workers/vips?worker";

export const load = () => {
	if (!browser) return;
	const worker = new VipsWorker();
	worker.onmessage = (e) => {
		console.log(e.data);
	};
};
