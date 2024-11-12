import { MagickConverter } from "./magick.svelte";
import { VipsConverter } from "./vips.svelte";

export const converters = [new VipsConverter(), new MagickConverter()];
