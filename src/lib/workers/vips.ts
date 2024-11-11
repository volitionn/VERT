import Vips from "wasm-vips";

Vips()
	.then((vips) => {
		postMessage({ type: "success", vips });
	})
	.catch((error) => {
		postMessage({ type: "error", error });
	});
