<script lang="ts">
	import { converters } from "$lib/converters/index.svelte";

	let files = $state<FileList>();

	$effect(() => {
		if (!converters.loaded) return;
	});
</script>

<input type="file" bind:files />
