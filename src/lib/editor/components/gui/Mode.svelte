<script>
	import Hand from '$lib/images/icons/Hand.svelte';
	import ArrowPtr from '$lib/images/icons/ArrowPtr.svelte';
	import MoveArrows from '$lib/images/icons/MoveArrows.svelte';
	import ArrowFromSquare from '$lib/images/icons/ArrowFromSquare.svelte';
	import Brush from '$lib/images/icons/Brush.svelte';

	/** @type {GUIData} */
	export let guiData;

	/**
	 * Sets the tool mode
	 * @param {ToolMode} [mode='pan']
	 */
	function setMode(mode = 'pan') {
		guiData.toolMode = mode;
	}
</script>

<div class="absolute top-0 right-0 z-10 mt-2 mr-2">
	<div
		class="flex gap-1 items-center bg-zinc-800 p-2 rounded border border-zinc-600 shadow-md shadow-black/25"
	>
		<!-- pan -->
		<button
			on:click={() => setMode('pan')}
			class:selected={guiData.toolMode === 'pan'}
			class:not-selected={guiData.toolMode !== 'pan'}
		>
			<Hand />
			{#if guiData.toolMode === 'pan'}
				<span class="absolute -bottom-1 -right-1">
					<ArrowPtr class="h-2.5" />
				</span>
			{/if}
		</button>

		<!-- move -->
		<button
			on:click={() => setMode('move')}
			class:selected={guiData.toolMode === 'move'}
			class:not-selected={guiData.toolMode !== 'move'}
		>
			<MoveArrows />
			{#if guiData.toolMode === 'move'}
				<span class="absolute -bottom-1 -right-1">
					<ArrowPtr class="h-2.5" />
				</span>
			{/if}
		</button>

		<!-- scale -->
		<button
			on:click={() => setMode('scale')}
			class:selected={guiData.toolMode === 'scale'}
			class:not-selected={guiData.toolMode !== 'scale'}
		>
			<ArrowFromSquare />
			{#if guiData.toolMode === 'scale'}
				<span class="absolute -bottom-1 -right-1">
					<ArrowPtr class="h-2.5" />
				</span>
			{/if}
		</button>

		<!-- brush -->
		<button
			on:click={() => setMode('brush')}
			class:selected={guiData.toolMode === 'brush'}
			class:not-selected={guiData.toolMode !== 'brush'}
		>
			<Brush />
			{#if guiData.toolMode === 'brush'}
				<span class="absolute -bottom-1 -right-1">
					<ArrowPtr class="h-2.5" />
				</span>
			{/if}
		</button>
	</div>
</div>

<style>
	button {
		@apply bg-zinc-600/50 p-1 rounded shadow shadow-black/25 relative;
	}

	.selected {
		@apply fill-white bg-blue-400;
	}

	.not-selected {
		@apply fill-zinc-400;
	}
</style>
