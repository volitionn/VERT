<script>
	import { converters } from "$lib/converters";
	import { files } from "$lib/store/index.svelte";

	if (files.files.length > 0) files.beenToConverterPage = true;
</script>

<div class="flex flex-col gap-4 w-full items-center">
	{#if files.files.length === 0}
		<p class="text-foreground-muted">
			No files uploaded. Head to the Upload tab to begin!
		</p>
	{/if}
	{#each files.files as file, i}
		<div
			class="flex items-center w-full max-w-screen-lg border-2 border-solid border-foreground-muted-alt rounded-xl px-4 py-2"
		>
			<div class="flex items-center flex-grow">
				{file.name}
			</div>
			<div class="flex gap-4 flex-shrink-0">
				<select
					class="border-2 border-solid border-foreground-muted-alt rounded-xl px-4 py-2 focus:!outline-none"
					bind:value={files.conversionTypes[i]}
				>
					{#each converters[0].supportedFormats as conversionType}
						<option value={conversionType}>{conversionType}</option>
					{/each}
				</select>
			</div>
		</div>
	{/each}
</div>
