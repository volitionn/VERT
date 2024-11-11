import type { IFile } from "$lib/types";
import { Converter } from "./converter";

export class VipsConverter extends Converter {
	public supportedFormats = [""];
	public convert(input: IFile, output: IFile): Promise<IFile> {
		throw new Error("Not implemented");
	}
}
