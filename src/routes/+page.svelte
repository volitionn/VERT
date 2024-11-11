<script lang="ts">
	import Uploader from "$lib/components/visual/Uploader.svelte";

	let files = $state<FileList>();
</script>

<Uploader bind:files />
