import type { IFile, OmitBetterStrict } from "$lib/types";

export class Converter {
	public supportedFormats: string[] = [];
	public async convert(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		input: OmitBetterStrict<IFile, "extension">,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		to: string,
	): Promise<IFile> {
		throw new Error("Not implemented");
	}
}
