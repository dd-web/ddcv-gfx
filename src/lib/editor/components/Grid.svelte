<script>
	/** @type {any} */
	export let entity;

	let enabled = true;
	let gap = 8;
	let width = 1;
	let color = `#C6C6C6`;

	$: if (entity) entity.setEnabled(enabled);
	$: if (entity) entity.setGapWidth(gap);
	$: if (entity) entity.setLineWidth(width);
	$: if (entity) entity.setColor(color);
</script>

<div class="p-2">
	<div class="bg-zinc-800">
		<p class="text-center">Grid</p>

		<!-- enabled -->
		<div class="flex justify-between px-4 py-2 mt-2">
			<label for="grid-enable">Enabled</label>
			<input bind:checked={enabled} type="checkbox" name="grid enabled" id="grid-enable" />
		</div>

		<!-- gap -->
		<div class="flex justify-between px-4 py-2">
			<label for="grid-gap">Gap</label>
			<input bind:value={gap} class="w-24 px-1" type="number" name="gap" id="grid-gap" />
		</div>

		<!-- width -->
		<div class="flex justify-between px-4 py-2">
			<label for="grid-width">Thickness</label>
			<input
				bind:value={width}
				class="w-24 px-1"
				type="number"
				name="width"
				id="grid-width"
				min="1"
				max="128"
			/>
		</div>

		<!-- color -->
		<div class="flex justify-between px-4 py-2">
			<label for="grid-color">Color</label>
			<input bind:value={color} class="w-24 px-1" type="color" name="gap" id="grid-color" />
		</div>
	</div>
</div>

<style>
	input {
		@apply text-black;
	}
</style>
