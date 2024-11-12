<script lang="ts">
	import { goto } from "$app/navigation";
	import Uploader from "$lib/components/functional/Uploader.svelte";
	import { converters } from "$lib/converters";
	import { files } from "$lib/store/index.svelte";

	let ourFiles = $state<File[]>();

	const runUpload = () => {
		files.files = [
			...files.files,
			...(ourFiles || []).map((f) => ({
				file: f,
				from: "." + f.name.split(".").slice(-1),
				to: converters[0].supportedFormats[0],
				blobUrl: URL.createObjectURL(f),
				id: Math.random().toString(36).substring(2),
			})),
		];

		ourFiles = [];

		if (files.files.length > 0 && !files.beenToConverterPage)
			goto("/convert");
	};

	// const convertAllFiles = async () => {
	// 	const promises = files.files?.map(async (file, i) => {
	// 		let conversionType = files.conversionTypes[i];
	// 		const converter = converters[0];
	// 		const convertedFile = await converter.convert(
	// 			{
	// 				name: file.name,
	// 				buffer: await file.arrayBuffer(),
	// 			},
	// 			conversionType,
	// 		);
	// 		files.downloadFns[i] = () => {
	// 			const url = URL.createObjectURL(
	// 				new Blob([convertedFile.buffer]),
	// 			);
	// 			const a = document.createElement("a");
	// 			a.href = url;
	// 			if (conversionType.startsWith("."))
	// 				conversionType = conversionType.slice(1);
	// 			a.download = `${file.name}.${conversionType}`;
	// 			a.target = "_self";
	// 			a.click();
	// 			URL.revokeObjectURL(url);
	// 		};
	// 	});
	// 	if (promises) await Promise.all(promises);
	// };
</script>

<div class="[@media(max-height:768px)]:block mt-32">
	<Uploader bind:files={ourFiles} onupload={runUpload} />
</div>

<style>
	/* for this page specifically */
	:global(html, body) {
		height: 100%;
	}
</style>
