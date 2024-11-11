import type { IFile } from "$lib/types";

export class Converter {
	public supportedFormats: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async convert(input: IFile, output: IFile): Promise<IFile> {
		throw new Error("Not implemented");
	}
}
