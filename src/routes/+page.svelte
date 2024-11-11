<script lang="ts">
	import Uploader from "$lib/components/visual/Uploader.svelte";
	import { converters } from "$lib/converters/index.svelte";

	let files = $state<FileList>();

	$effect(() => {
		if (!converters.loaded) return;
	});
</script>

<Uploader bind:files />
