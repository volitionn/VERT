<script lang="ts">
	import Uploader from "$lib/components/visual/Uploader.svelte";
	import { converters } from "$lib/converters";
	import { files } from "$lib/store/index.svelte";

	$effect(() => {
		$inspect(files);
	});

	const convertAllFiles = async () => {
		const promises = files.files?.map(async (file, i) => {
			let conversionType = files.conversionTypes[i];
			const converter = converters[0];
			const convertedFile = await converter.convert(
				{
					name: file.name,
					buffer: await file.arrayBuffer(),
				},
				conversionType,
			);
			files.downloadFns[i] = () => {
				const url = URL.createObjectURL(
					new Blob([convertedFile.buffer]),
				);
				const a = document.createElement("a");
				a.href = url;
				if (conversionType.startsWith("."))
					conversionType = conversionType.slice(1);
				a.download = `${file.name}.${conversionType}`;
				a.target = "_self";
				a.click();
				URL.revokeObjectURL(url);
			};
		});
		if (promises) await Promise.all(promises);
	};
</script>

<Uploader bind:files={files.files} />

<style>
	/* for this page specifically */
	:global(html, body) {
		height: 100%;
	}
</style>
