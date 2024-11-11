import type { IFile } from "./file";

interface VipsConvertMessage {
	type: "convert";
	input: IFile;
	to: string;
}

interface VipsFinishedMessage {
	type: "finished";
	output: IFile;
}

export type VipsWorkerMessage = (VipsConvertMessage | VipsFinishedMessage) & {
	id: number;
};
