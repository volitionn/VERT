import { init } from "./util/magick";

export async function load({ fetch }) {
	await init(fetch);
}
