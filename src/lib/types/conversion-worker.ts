import type { IFile } from "./file";

interface ConvertMessage {
	type: "convert";
	input: IFile;
	to: string;
}

interface FinishedMessage {
	type: "finished";
	output: IFile;
}

interface LoadedMessage {
	type: "loaded";
}

interface ErrorMessage {
	type: "error";
	error: string;
}

export type WorkerMessage = (
	| ConvertMessage
	| FinishedMessage
	| LoadedMessage
	| ErrorMessage
) & {
	id: number;
};
