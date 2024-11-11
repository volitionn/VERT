<script lang="ts">
	import Uploader from "$lib/components/visual/Uploader.svelte";
	import { converters } from "$lib/converters";

	let conversionTypes = $state<string[]>([]);
	let downloadFns = $state<(() => void)[]>([]);
	let files = $state<FileList>();
	let iterableFiles = $derived.by(() => {
		if (!files) return [];
		return Array.from(files);
	});

	const convertAllFiles = async () => {
		const promises = iterableFiles.map(async (file, i) => {
			let conversionType = conversionTypes[i];
			const converter = converters[0];
			const convertedFile = await converter.convert(
				{
					name: file.name,
					buffer: await file.arrayBuffer(),
				},
				conversionType,
			);
			downloadFns[i] = () => {
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
		await Promise.all(promises);
	};
</script>

<div class="flex flex-col items-center">
	<div class="max-w-screen-lg w-full">
		<div class="h-80 justify-self-center mt-40">
			<Uploader bind:files />
		</div>
		<div class="flex flex-col items-center">
			{#each iterableFiles as file, i}
				<div
					class="flex items-center w-full max-w-screen-lg border-2 border-solid border-foreground rounded-xl px-4 py-2 mt-4"
				>
					<div class="flex items-center flex-grow">
						{file.name}
					</div>
					<div class="flex gap-4 flex-shrink-0">
						{#if downloadFns[i]}
							<button
								class="px-4 py-2 border-2 border-solid border-foreground rounded-xl"
								onclick={downloadFns[i]}
							>
								Download
							</button>
						{/if}
						<!-- <input
							type="text"
							class="border-2 border-solid border-foreground rounded-xl px-4 py-2 focus:!outline-none"
							bind:value={conversionTypes[i]}
							placeholder="jpeg"
						/> -->
						<select
							class="border-2 border-solid border-foreground rounded-xl px-4 py-2 focus:!outline-none"
							bind:value={conversionTypes[i]}
						>
							{#each converters[0].supportedFormats as conversionType}
								<option value={conversionType}
									>{conversionType}</option
								>
							{/each}
						</select>
					</div>
				</div>
			{/each}
			<button
				class="mt-4 px-4 py-2 border-2 border-solid border-foreground rounded-xl"
				onclick={convertAllFiles}
			>
				Convert
			</button>
		</div>
	</div>
</div>

<style>
	/* for this page specifically */
	:global(html, body) {
		height: 100%;
	}
</style>
