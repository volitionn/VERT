<script lang="ts">
	import Uploader from "$lib/components/visual/Uploader.svelte";

	let files = $state<FileList>();
</script>

<div class="flex items-center justify-center h-full">
	<Uploader bind:files />
</div>

<style>
	/* for this page specifically */
	:global(html, body) {
		height: 100%;
	}
</style>
