<script lang="ts">
	import { Upload } from "lucide-svelte";
	import clsx from "clsx";

	let fileList = $state<FileList | undefined>();

	interface Props {
		files: File[] | undefined;
	}

	$effect(() => {
		if (!fileList) return;
		files = Array.from(fileList);
	});

	let fileInput = $state<HTMLInputElement>();
	let dragOver = $state(false);

	let { files = $bindable() }: Props = $props();

	function upload() {
		if (!fileInput) return;
		fileInput.click();
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		if (!event.dataTransfer) return;
		if (!files) files = Array.from(event.dataTransfer.files);
		else files.push(...Array.from(event.dataTransfer.files));
	}
</script>

<button
	onclick={upload}
	ondragover={() => (dragOver = true)}
	ondragleave={() => (dragOver = false)}
	class={clsx(
		"w-full h-80 max-w-screen-lg flex items-center justify-center cursor-pointer flex-col border-2 border-solid border-foreground-muted-alt rounded-2xl hover:scale-95 hover:opacity-70 transition-all duration-150 ease-out",
		{
			"scale-95 opacity-70": dragOver,
		},
	)}
	ondrop={drop}
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

<input
	type="file"
	class="hidden"
	bind:files={fileList}
	bind:this={fileInput}
	multiple
/>
