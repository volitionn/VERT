<script lang="ts">
	import { onMount } from "svelte";
	import "../app.css";
	import { goto } from "$app/navigation";
	import clsx from "clsx";
	import { blur, duration, transition } from "$lib/animation";
	import { quintOut } from "svelte/easing";
	import { files } from "$lib/store/index.svelte";
	let { children, data } = $props();

	let navWidth = $state(1);
	let shouldGoBack = $state(false);

	const links = $derived<{
		[key: string]: {
			href: string;
			alert?: boolean;
		};
	}>({
		Upload: { href: "/" },
		[files.files.length > 0
			? `Convert ${files.files.length} file${files.files.length > 1 ? "s" : ""}`
			: `Convert`]: { href: "/convert", alert: files.shouldShowAlert },
	});

	const linkCount = $derived(Object.keys(links).length);
	const linkIndex = $derived(
		Object.keys(links).findIndex(
			(link) => links[link].href === data.pathname,
		),
	);
</script>

<div class="w-full h-full flex items-center pt-72 flex-col gap-4">
	<div
		bind:clientWidth={navWidth}
		class="bg-background relative w-full h-16 max-w-screen-lg border-2 p-1 border-solid border-foreground-muted-alt rounded-2xl flex"
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
				class="w-1/2 h-full flex items-center justify-center rounded-xl relative"
				onclick={() => {
					const keys = Object.keys(links);
					const currentIndex = keys.findIndex(
						(key) => links[key].href === data.pathname,
					);
					const nextIndex = keys.findIndex(
						(key) => links[key] === link,
					);
					shouldGoBack = nextIndex < currentIndex;
					console.log({ shouldGoBack });
					goto(link.href);
				}}
			>
				<span class="mix-blend-difference invert">
					{name}
				</span>
			</button>
		{/each}
	</div>
	<div class="w-full grid grid-cols-1 grid-rows-1 relative">
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
