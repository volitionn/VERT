import type { IFile } from "$lib/types";
import { Converter } from "./converter.svelte";
import MagickWorker from "$lib/workers/magick?worker";
import { browser } from "$app/environment";
import type { WorkerMessage, OmitBetterStrict } from "$lib/types";
import { MagickFormat } from "@imagemagick/magick-wasm";

export class MagickConverter extends Converter {
	private worker: Worker = browser ? new MagickWorker() : null!;
	private id = 0;
	public name = "imagemagick";
	public ready = $state(false);
	public supportedFormats = Object.keys(MagickFormat).map(
		(key) => `.${key.toLowerCase()}`,
	);

	constructor() {
		super();
		if (!browser) return;
		this.worker.onmessage = (e) => {
			const message: WorkerMessage = e.data;
			if (message.type === "loaded") this.ready = true;
		};
	}

	public async convert(
		input: OmitBetterStrict<IFile, "extension">,
		to: string,
	): Promise<IFile> {
		const res = await this.sendMessage({
			type: "convert",
			input: input as unknown as IFile,
			to,
		});

		if (res.type === "finished") {
			return res.output;
		}

		if (res.type === "error") {
			throw new Error(res.error);
		}

		throw new Error("Unknown message type");
	}

	private sendMessage(
		message: OmitBetterStrict<WorkerMessage, "id">,
	): Promise<OmitBetterStrict<WorkerMessage, "id">> {
		const id = this.id++;
		let resolved = false;
		return new Promise((resolve) => {
			const onMessage = (e: MessageEvent) => {
				if (e.data.id === id) {
					this.worker.removeEventListener("message", onMessage);
					resolve(e.data);
					resolved = true;
				}
			};

			setTimeout(() => {
				if (!resolved) {
					this.worker.removeEventListener("message", onMessage);
					throw new Error("Timeout");
				}
			}, 60000);

			this.worker.addEventListener("message", onMessage);

			this.worker.postMessage({ ...message, id });
		});
	}
}
