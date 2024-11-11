<script lang="ts">
	import { converters } from "$lib/converters";
	import type { Converter } from "$lib/converters/converter";

	let file = $state<File>();
	let to = "";

	const convert = async (converter: Converter, file: File, to: string) => {
		const buffer = await file.arrayBuffer();
		const result = await converter.convert({
			name: file.name.split(".").slice(0, -1).join("."),
			buffer
		}, to);
		console.log(result);
	}
</script>

<div class="flex flex-col">
	<input type="file" onchange={e => file = (e.target as any).files[0]} />
	<input type="text" placeholder="to" bind:value={to} />
	<button onclick={() => convert(converters[0], file!, to)}>Go</button>
</div>