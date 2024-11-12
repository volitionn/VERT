<script>
	import ProgressiveBlur from "$lib/components/visual/effects/ProgressiveBlur.svelte";
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
	{#each files.files.reverse() as file, i}
		<div
			class="flex relative items-center w-full border-2 border-solid border-foreground-muted-alt rounded-xl pl-4 pr-2 py-2"
		>
			<div class="flex items-center w-full z-50 relative">
				<div
					class="flex items-center flex-grow"
					style="text-shadow: 0px 0px 6px white, 0px 0px 12px white"
				>
					{file.file.name}
				</div>
				<div class="flex items-center gap-2 flex-shrink-0">
					<span>from</span>
					<span
						class="py-2 px-3 font-display bg-foreground text-background rounded-xl"
						>.{file.file.name.split(".").slice(-1)}</span
					>
					<span>to</span>
					<select
						class="font-display border-2 border-solid border-foreground-muted-alt rounded-xl p-2 focus:!outline-none"
						bind:value={files.conversionTypes[i]}
					>
						{#each converters[0].supportedFormats as conversionType}
							<option value={conversionType}
								>{conversionType}</option
							>
						{/each}
					</select>
				</div>
			</div>
			<!-- god knows why, but setting opacity > 0.98 causes a z-ordering issue in firefox ??? -->
			<div
				class="absolute top-0 -z-50 left-0 w-full h-full rounded-[10px] overflow-hidden opacity-[0.98]"
			>
				<div
					class="bg-cover bg-center w-full h-full"
					style="background-image: url({file.blobUrl});"
				></div>
				<div class="absolute top-0 right-0 w-5/6 h-full">
					<ProgressiveBlur
						direction="right"
						endIntensity={64}
						iterations={6}
						fadeTo="rgba(255, 255, 255, 0.8)"
					/>
				</div>
			</div>
		</div>
	{/each}
</div>
