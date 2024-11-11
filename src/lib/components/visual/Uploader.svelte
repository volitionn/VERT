<script lang="ts">
	import { Upload } from "lucide-svelte";

	interface Props {
		files: FileList | undefined;
	}

	let fileInput = $state<HTMLInputElement>();

	let { files = $bindable() }: Props = $props();

	const upload = () => {
		if (!fileInput) return;
		fileInput.click();
	};
</script>

<button
	onclick={upload}
	class="flex items-center justify-center cursor-pointer flex-col border-2 border-solid border-foreground rounded-xl px-4 py-2 w-full h-full"
>
	<Upload />
	<h2>Drop or click to upload files</h2>
	<p class="text-foreground-muted">the</p>
</button>

<input type="file" class="hidden" bind:files bind:this={fileInput} />
