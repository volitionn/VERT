import Vips from "wasm-vips";

class Converters {
	public vips = $state<typeof Vips>(null!);
	public loaded = $derived(this.vips !== null);
}

export const converters = new Converters();

// Vips().then((vips) => {
// 	converters.vips = vips;
// });

// the above *does* work but it blocks the ui thread whilst wasm is loading
// we can use a web worker to remedy this, see +layout.ts for details
