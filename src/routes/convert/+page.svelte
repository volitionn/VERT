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
			class="flex items-center w-full border-2 border-solid border-foreground-muted-alt rounded-xl pl-4 pr-2 py-2"
		>
			<div class="flex items-center flex-grow">
				{file.name}
			</div>
			<div class="flex items-center gap-2 flex-shrink-0">
				<span>from</span>
				<span
					class="py-2 px-3 font-display bg-foreground text-background rounded-xl"
					>.{file.name.split(".").slice(-1)}</span
				>
				<span>to</span>
				<select
					class="font-display border-2 border-solid border-foreground-muted-alt rounded-xl p-2 focus:!outline-none"
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
