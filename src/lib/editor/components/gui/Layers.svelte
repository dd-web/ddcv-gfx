<script>
	import ImageLayer from './layers/ImageLayer.svelte';
	import Layer from './layers/Layer.svelte';

	/** @type {GUIData} */
	export let guiData; // mostly for brush settings etc. not implemented yet

	/** @type {any} */
	export let canvasData;

	/** @type {any} */
	export let entityStore;

	$: entitiesOrdered = $entityStore.sort(
		/** @param {any} a, @param {any} b */ (a, b) => a.zIndex - b.zIndex
	);
</script>

<div>
	<p>Layers</p>
	<ul>
		{#each entitiesOrdered as ent (ent.id)}
			<Layer
				on:up={(e) => entityStore.moveUp(e.detail)}
				on:down={(e) => entityStore.moveDown(e.detail)}
				on:hide={(e) => entityStore.hideEntity(e.detail)}
				on:show={(e) => entityStore.showEntity(e.detail)}
				on:select={(e) => entityStore.selectEntity(e.detail)}
				on:opacity={(e) => entityStore.changeOpacity(e.detail.id, e.detail.opacity)}
				{ent}
			>
				{#if ent.type === 'image'}
					<ImageLayer imageEntity={ent} bind:canvasData />
				{:else}
					<p>No Layer Information Provided</p>
				{/if}
			</Layer>
		{/each}
	</ul>
</div>
