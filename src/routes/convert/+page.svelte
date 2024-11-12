<script lang="ts">
	import { blur, duration, flip, transition } from "$lib/animation";
	import Dropdown from "$lib/components/functional/Dropdown.svelte";
	import ProgressiveBlur from "$lib/components/visual/effects/ProgressiveBlur.svelte";
	import { converters } from "$lib/converters";
	import { files } from "$lib/store/index.svelte";
	import clsx from "clsx";
	import { XIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { quintOut } from "svelte/easing";
	import { downloadZip } from "client-zip";

	const reversed = $derived(files.files.slice().reverse());

	let finisheds = $state(
		Array.from({ length: files.files.length }, () => false),
	);

	let converterName = $state(converters[0].name);

	let converter = $derived(converters.find((c) => c.name === converterName))!;

	onMount(() => {
		finisheds.forEach((_, i) => {
			const duration = 750 + i * 50 - 32;
			setTimeout(() => {
				finisheds[i] = true;
				console.log(`finished ${i}`);
			}, duration);
		});
	});

	const convertAll = async () => {
		// for (let i = 0; i < files.files.length; i++) {
		// 	const file = files.files[i];
		// 	const to = files.conversionTypes[i];
		// 	const converter = converters.find(
		// 		(c) => c.name === files.conversionTypes[i],
		// 	);
		// 	if (!converter) {
		// 		console.error("Converter not found");
		// 		continue;
		// 	}
		// 	const converted = await converter.convert({
		// 		name: file.file.name,
		// 		buffer: await file.file.arrayBuffer(),
		// 	}, to);
		// 	files.files[i] = {
		// 		...file,
		// 		file: new File([converted.buffer], file.file.name, {
		// 			type: file.file.type,
		// 		}),
		// 		blobUrl: URL.createObjectURL(new Blob([converted.buffer], { type: file.file.type })),
		// 	};
		// }

		const promises: Promise<void>[] = [];
		for (let i = 0; i < files.files.length; i++) {
			const file = files.files[i];
			const to = files.conversionTypes[i];
			const converter = converters.find((c) => c.name === converterName);
			if (!converter) {
				console.error("Converter not found");
				continue;
			}
			promises.push(
				(async () => {
					const converted = await converter.convert(
						{
							name: file.file.name,
							buffer: await file.file.arrayBuffer(),
						},
						to,
					);
					files.files[i] = {
						...file,
						result: {
							...converted,
							blobUrl: URL.createObjectURL(
								new Blob([converted.buffer], {
									type: file.file.type,
								}),
							),
							animating: true,
						},
					};
					await new Promise((r) => setTimeout(r, 750));
					if (
						files.files[i].result !== null &&
						files.files[i].result !== undefined
					)
						files.files[i].result!.animating = false;
				})(),
			);
		}

		await Promise.all(promises);
		console.log("done");
	};

	const downloadAll = async () => {
		const dlFiles: any[] = [];
		for (let i = 0; i < files.files.length; i++) {
			const file = files.files[i];
			const result = file.result;
			if (!result) {
				console.error("No result found");
				continue;
			}
			dlFiles.push({
				name:
					file.file.name.replace(/\.[^/.]+$/, "") +
					files.conversionTypes[i],
				lastModified: Date.now(),
				input: result.buffer,
			});
		}
		if (files.files.length === 0) return;
		if (files.files.length === 1) {
			// download the image only
			const blob = URL.createObjectURL(
				new Blob([dlFiles[0].input], {
					type: files.files[0].file.type,
				}),
			);
			const a = document.createElement("a");
			a.href = blob;
			a.download = `${new Date().toISOString()}-vert-converted${
				files.conversionTypes[0]
			}`;
			a.click();
			URL.revokeObjectURL(blob);
			a.remove();
			return;
		}
		const blob = await downloadZip(dlFiles, "converted.zip").blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `VERT-Converted_${new Date().toISOString()}.zip`;
		a.click();
		URL.revokeObjectURL(url);
		a.remove();
	};
</script>

<div class="grid grid-cols-1 grid-rows-1 w-full">
	{#if files.files.length === 0}
		<p class="text-foreground-muted col-start-1 row-start-1 text-center">
			No files uploaded. Head to the Upload tab to begin!
		</p>
	{:else}
		<div
			class="flex flex-col gap-4 w-full items-center col-start-1 row-start-1"
			out:blur={{
				duration,
				easing: quintOut,
				blurMultiplier: 16,
			}}
		>
			<div
				class="w-full p-4 max-w-screen-lg border-solid flex-col border-2 rounded-2xl border-foreground-muted-alt flex flex-shrink-0"
			>
				<h2 class="font-bold text-xl mb-1">Options</h2>
				<div class="flex flex-col mb-1 w-full gap-4 mt-2">
					<div class="flex flex-col gap-3 w-fit">
						<h3>Set all target formats</h3>
						<Dropdown
							options={converter.supportedFormats}
							onselect={(o) => {
								files.conversionTypes = Array.from(
									{ length: files.files.length },
									() => o,
								);

								files.files.forEach((file) => {
									file.result = null;
								});
							}}
						/>
					</div>
				</div>

				<h2 class="font-bold text-base mb-1 mt-6">Advanced</h2>
				<div class="flex flex-col gap-4 mt-2">
					<div class="flex flex-col gap-3 w-fit">
						<h3>Converter backend</h3>
						<Dropdown
							options={converters.map(
								(converter) => converter.name,
							)}
							bind:selected={converterName}
						/>
					</div>
				</div>

				<div class="flex gap-4 mt-8">
					<button
						onclick={convertAll}
						class={clsx("btn flex-grow", {
							"btn-highlight": !files.files.find((i) => i.result),
						})}
						>Convert{files.files.length > 1 ? " All" : ""}</button
					>
					<button
						onclick={() => downloadAll}
						class={clsx("btn flex-grow", {
							"opacity-50 pointer-events-none": files.files.find(
								(i) => !i.result,
							),
							"btn-highlight": !files.files.find(
								(i) => !i.result,
							),
						})}
						>Download{files.files.length > 1 ? " All" : ""}</button
					>
				</div>
			</div>
			{#each reversed as file, i (file.id)}
				<div
					class={clsx("w-full rounded-xl", {
						"finished-anim": file.result?.animating,
					})}
					animate:flip={{ duration, easing: quintOut }}
					out:blur={{
						duration,
						easing: quintOut,
						blurMultiplier: 16,
					}}
					style="--transition: ease-in-out;"
				>
					<div
						class={clsx(
							"h-16 px-3 flex relative flex-shrink-0 items-center w-full rounded-xl",
							{
								"initial-fade": !finisheds[i],
							},
						)}
						style="--delay: {i *
							50}ms; --transition: {transition}; --duration: {duration}ms; z-index: {files
							.files.length - i}; border: solid 3px {file.result
							? 'var(--accent-bg)'
							: 'var(--fg-muted-alt)'}; transition: border 1000ms ease;"
					>
						<div
							class="flex items-center justify-between w-full z-50 relative"
						>
							<div
								class={clsx(
									"py-2 px-3 rounded-xl transition-colors duration-300",
									{
										"bg-accent-background text-accent-foreground":
											file.result,
										"bg-background text-foreground":
											!file.result,
									},
								)}
							>
								{file.file.name}
							</div>
							<div class="flex items-center gap-3 flex-shrink-0">
								{#if converter.supportedFormats.includes(file.from)}
									<span>from</span>
									<span
										class="py-2 px-3 font-display bg-foreground text-background rounded-xl"
										>{file.from}</span
									>
									<span>to</span>
									<!-- <select bind:value={files.conversionTypes[i]}>
									{#each converter.supportedFormats as conversionType}
										<option value={conversionType}
											>{conversionType}</option
										>
									{/each}
								</select> -->
									<Dropdown
										options={converter.supportedFormats}
										bind:selected={files.conversionTypes[i]}
										onselect={() => {
											file.result = null;
										}}
									/>
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
						{#if converter.supportedFormats.includes(file.from)}
							<!-- god knows why, but setting opacity > 0.98 causes a z-ordering issue in firefox ??? -->
							<div
								class="absolute top-0 -z-50 left-0 w-full h-full rounded-[10px] overflow-hidden opacity-[0.98]"
							>
								<div
									class="bg-cover bg-center w-full h-full"
									style="background-image: url({file.blobUrl});"
								></div>
								<div
									class="absolute top-0 right-0 w-5/6 h-full"
								>
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
				</div>
			{/each}
			<div class="w-full h-4 flex-shrink-0"></div>
		</div>
	{/if}
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

	@keyframes finished-animation {
		0% {
			transform: scale(1);
			filter: blur(0);
		}

		50% {
			transform: scale(1.02);
			filter: blur(4px);
		}

		100% {
			transform: scale(1);
			filter: blur(0);
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

	.finished-anim {
		animation: finished-animation 750ms;
		animation-timing-function: var(--transition);
	}
</style>
