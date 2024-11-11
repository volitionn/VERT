<script lang="ts">
	import { Upload } from "lucide-svelte";

	interface Props {
		files: FileList | undefined;
	}

	let { files = $bindable() }: Props = $props();
</script>

<div class="flex items-center justify-center h-full">
	<div
		class="flex items-center justify-center border-2 border-solid border-black w-full max-w-screen-lg h-80"
	>
		<Upload />
	</div>
</div>

<input type="file" class="hidden" bind:files />
