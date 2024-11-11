import type { VipsWorkerMessage, OmitBetterStrict } from "$lib/types";
import Vips from "wasm-vips";

const vipsPromise = Vips();

vipsPromise
	.then(() => {
		postMessage({ type: "loaded" });
	})
	.catch((error) => {
		postMessage({ type: "error", error });
	});

const handleMessage = async (
	message: VipsWorkerMessage,
): Promise<OmitBetterStrict<VipsWorkerMessage, "id"> | undefined> => {
	const vips = await vipsPromise;
	switch (message.type) {
		case "convert": {
			if (!message.to.startsWith(".")) message.to = `.${message.to}`;
			const image = vips.Image.newFromBuffer(message.input.buffer);
			const output = image.writeToBuffer(message.to);
			return {
				type: "finished",
				output: {
					...message.input,
					buffer: output.buffer,
					extension: message.to,
				},
			};
		}
	}
};

onmessage = async (e) => {
	const message: VipsWorkerMessage = e.data;
	const res = await handleMessage(message);
	if (!res) return;
	postMessage({
		...res,
		id: message.id,
	});
};
