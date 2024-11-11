<script lang="ts">
	import { Upload } from "lucide-svelte";

	interface Props {
		files: FileList | undefined;
	}

	let fileInput = $state<HTMLInputElement>();
	let dragOver = $state(false);

	let { files = $bindable() }: Props = $props();

	function upload() {
		if (!fileInput) return;
		fileInput.click();
	}
</script>

<button
	onclick={upload}
	ondragover={() => (dragOver = true)}
	ondragleave={() => (dragOver = false)}
	class="file-uploader"
	class:_drag-over={dragOver}
>
	<div
		class="size-16 rounded-full text-background bg-foreground flex items-center justify-center"
	>
		<Upload class="size-8" />
	</div>
	<h2 class="font-display text-2xl mt-6">Drop or click to upload files</h2>
	<p class="text-foreground-muted mt-4">
		All processing is done on your device. No file or size limit.
	</p>
</button>

<input type="file" class="hidden" bind:files bind:this={fileInput} multiple />

<style>
	.file-uploader {
		@apply w-full h-80 max-w-screen-lg flex items-center justify-center cursor-pointer
			flex-col border-2 border-solid border-foreground-muted-alt rounded-2xl
			hover:scale-95 hover:opacity-70 transition-all duration-150 ease-out;
	}

	.file-uploader._drag-over {
		@apply scale-95 opacity-70;
	}
</style>
