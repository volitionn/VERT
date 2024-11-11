class Files {
	public files = $state<File[]>([]);
	public conversionTypes = $state<string[]>([]);
	public downloadFns = $state<(() => void)[]>([]);
	public beenToConverterPage = $state(false);
	public shouldShowAlert = $derived(
		!this.beenToConverterPage && this.files.length > 0,
	);
}

export const files = new Files();
