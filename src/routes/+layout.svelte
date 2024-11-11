<script lang="ts">
	import "../app.css";
	import { goto } from "$app/navigation";
	import { blur, duration } from "$lib/animation";
	import { quintOut } from "svelte/easing";
	import { files } from "$lib/store/index.svelte";
	import Logo from "$lib/components/visual/svg/Logo.svelte";
	import { fade, fly } from "svelte/transition";
	let { children, data } = $props();

	let navWidth = $state(1);
	let shouldGoBack = $state(false);

	const links = $derived<{
		[key: string]: string;
	}>({
		Upload: "/",
		[files.files.length > 0
			? `Convert ${files.files.length} file${files.files.length > 1 ? "s" : ""}`
			: `Convert`]: "/convert",
		About: "/about",
	});

	const linkCount = $derived(Object.keys(links).length);
	const linkIndex = $derived(
		Object.keys(links).findIndex((link) => links[link] === data.pathname),
	);
</script>

<div class="w-full h-full flex items-center pt-48 flex-col gap-10">
	<div
		class="w-full max-w-screen-lg p-1 border-solid border-2 rounded-2xl border-foreground-muted-alt grid"
		style="grid-template-columns: auto 1fr"
	>
		<div
			class="px-4 m-1 mr-3 flex items-center bg-accent-background fill-accent-foreground rounded-xl"
		>
			<div class="h-6">
				<Logo />
			</div>
		</div>

		<div
			bind:clientWidth={navWidth}
			class="w-full flex bg-background relative h-16"
		>
			<div
				class="absolute pointer-events-none top-1 bg-foreground h-[calc(100%-8px)] rounded-xl"
				style="width: {navWidth / linkCount - 8}px; left: {(navWidth /
					linkCount) *
					linkIndex +
					4}px; transition: {duration - 200}ms ease left;"
			></div>
			{#each Object.entries(links) as [name, link] (link)}
				<button
					class="w-1/2 h-full flex items-center justify-center rounded-xl relative font-display overflow-hidden"
					onclick={() => {
						const keys = Object.keys(links);
						const currentIndex = keys.findIndex(
							(key) => links[key] === data.pathname,
						);
						const nextIndex = keys.findIndex(
							(key) => links[key] === link,
						);
						shouldGoBack = nextIndex < currentIndex;
						console.log({ shouldGoBack });
						goto(link);
					}}
				>
					<div class="grid grid-cols-1 grid-rows-1">
						{#key name}
							<span
								class="mix-blend-difference invert col-start-1 row-start-1"
								in:fly={{
									duration,
									easing: quintOut,
									y: -50,
								}}
								out:fly={{
									duration,
									easing: quintOut,
									y: 50,
								}}
							>
								{name}
							</span>
						{/key}
					</div>
				</button>
			{/each}
		</div>
	</div>
	<div class="w-full max-w-screen-lg grid grid-cols-1 grid-rows-1 relative">
		{#key data.pathname}
			<div class="w-full">
				<div
					class="absolute top-0 left-0 w-full h-full flex justify-center"
					in:blur={{
						duration,
						easing: quintOut,
						blurMultiplier: 12,
						x: {
							start: !shouldGoBack ? 250 : -250,
							end: 0,
						},
						scale: {
							start: 0.75,
							end: 1,
						},
					}}
					out:blur={{
						duration,
						easing: quintOut,
						blurMultiplier: 12,
						x: {
							start: 0,
							end: !shouldGoBack ? -250 : 250,
						},
						scale: {
							start: 1,
							end: 0.75,
						},
					}}
				>
					{@render children()}
				</div>
			</div>
		{/key}
	</div>
</div>
