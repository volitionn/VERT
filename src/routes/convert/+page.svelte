<script lang="ts">
	import { blur, duration, flip, transition } from "$lib/animation";
	import ProgressiveBlur from "$lib/components/visual/effects/ProgressiveBlur.svelte";
	import { converters } from "$lib/converters";
	import { files } from "$lib/store/index.svelte";
	import clsx from "clsx";
	import { XIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { quintOut } from "svelte/easing";

	const reversed = $derived(files.files.slice().reverse());

	let finisheds = $state(
		Array.from({ length: files.files.length }, () => false),
	);

	onMount(() => {
		finisheds.forEach((_, i) => {
			const duration = 750 + i * 50 - 32;
			setTimeout(() => {
				finisheds[i] = true;
				console.log(`finished ${i}`);
			}, duration);
		});
	});
</script>

<div class="grid grid-cols-1 grid-rows-1 w-full">
	{#if files.files.length === 0}
		<p class="text-foreground-muted col-start-1 row-start-1 text-center">
			No files uploaded. Head to the Upload tab to begin!
		</p>
	{/if}
	<div
		class="flex flex-col gap-4 w-full items-center col-start-1 row-start-1"
	>
		{#each reversed as file, i (file.id)}
			<div
				animate:flip={{ duration, easing: quintOut }}
				out:blur={{
					duration,
					easing: quintOut,
					blurMultiplier: 16,
				}}
				class={clsx(
					"h-16 pl-4 pr-2 flex relative items-center w-full border-2 border-solid border-foreground-muted-alt rounded-xl",
					{
						"initial-fade": !finisheds[i],
					},
				)}
				style="--delay: {i *
					50}ms; --transition: {transition}; --duration: {duration}ms;"
			>
				<div class="flex items-center w-full z-50 relative">
					<div
						class="flex items-center flex-grow"
						style="text-shadow: 0px 0px 6px white, 0px 0px 12px white"
					>
						{file.file.name}
					</div>
					<div class="flex items-center gap-3 flex-shrink-0">
						{#if converters[0].supportedFormats.includes(file.from)}
							<span>from</span>
							<span
								class="py-2 px-3 font-display bg-foreground text-background rounded-xl"
								>{file.from}</span
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
						{:else}
							<span
								class="py-2 px-3 font-display bg-foreground-failure text-white rounded-xl"
								>{file.from}</span
							>

							<span class="text-foreground-failure">
								is not supported!
							</span>
						{/if}
						<button
							onclick={() => {
								// delete the file from the list
								files.files = files.files.filter(
									(f) => f !== file,
								);
							}}
							class="ml-2 mr-1"
						>
							<XIcon size="18" />
						</button>
					</div>
				</div>
				{#if converters[0].supportedFormats.includes(file.from)}
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
								endIntensity={128}
								iterations={6}
								fadeTo="rgba(255, 255, 255, 0.8)"
							/>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	@keyframes initial-transition {
		0% {
			transform: translateY(50px);
			filter: blur(16px);
			opacity: 0;
		}

		100% {
			transform: translateY(0);
			filter: blur(0);
			opacity: 1;
		}
	}

	.initial-fade {
		animation: initial-transition 750ms var(--delay) ease-out;
		animation-timing-function: var(--transition);
		opacity: 0;
	}

	.initial-fade.finished {
		animation: none;
		opacity: 1 !important;
	}
</style>
