<script lang="ts">
	import { Upload } from "lucide-svelte";

	interface Props {
		files: FileList | undefined;
	}

	let { files = $bindable() }: Props = $props();
</script>

<div
	class="flex items-center justify-center flex-col border-2 border-solid border-foreground rounded-xl w-full max-w-screen-lg h-80"
>
	<Upload />
	<h2>Drop or click to upload files</h2>
	<p class="text-foreground-muted">the</p>
</div>

<input type="file" class="hidden" bind:files />
