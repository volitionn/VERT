class Files {
	public files = $state<
		{
			file: File;
			to: string;
			blobUrl: string;
			id: string;
		}[]
	>([]);
	public conversionTypes = $state<string[]>([]);
	public beenToConverterPage = $state(false);
	public shouldShowAlert = $derived(
		!this.beenToConverterPage && this.files.length > 0,
	);
}

export const files = new Files();
