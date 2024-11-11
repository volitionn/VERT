import type { IFile } from "$lib/types";
import { Converter } from "./converter";
import VipsWorker from "$lib/workers/vips?worker";
import { browser } from "$app/environment";
import type { VipsWorkerMessage, OmitBetterStrict } from "$lib/types";

export class VipsConverter extends Converter {
	private worker: Worker = browser ? new VipsWorker() : null!;
	private id = 0;
	public supportedFormats = [""];

	constructor() {
		super();
		if (!browser) return;
		this.worker.onmessage = (e) => {
			console.log(e.data);
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

		throw new Error("Unknown message type");
	}

	private sendMessage(
		message: OmitBetterStrict<VipsWorkerMessage, "id">,
	): Promise<OmitBetterStrict<VipsWorkerMessage, "id">> {
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
			}, 20000);

			this.worker.addEventListener("message", onMessage);

			this.worker.postMessage({ ...message, id });
		});
	}
}
