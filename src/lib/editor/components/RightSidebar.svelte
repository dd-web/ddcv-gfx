<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Brush from './gui/Brush.svelte';
	import Layers from './gui/Layers.svelte';

	/** @type {GUIData} */
	export let guiData;

	/** @type {any} */
	export let entityStore;

	/** @type {any} */
	export let canvasData;
</script>

<div class="bg-neutral-900 w-full rounded-md h-fill">
	<Brush bind:color={guiData.brushColor} bind:size={guiData.brushSize} />
	<Layers {guiData} {entityStore} bind:canvasData />
</div>
