<script>
	export let size = 1;
	export let color = '#000000';

	let sizeOptions = [
		{ value: 1, label: '1px' },
		{ value: 2, label: '2px' },
		{ value: 3, label: '3px' },
		{ value: 4, label: '4px' },
		{ value: 5, label: '5px' },
		{ value: 6, label: '6px' },
		{ value: 7, label: '7px' },
		{ value: 8, label: '8px' }
	];
</script>

<div class="">
	<p class="text-center pt-2">Brush Settings</p>

	<div class="flex justify-around items-center my-2">
		<div>
			<label class="mx-1" for="brush-color">Color:</label>
			<input id="brush-color" type="color" bind:value={color} />
		</div>

		<div>
			<label class="mx-1" for="brush-size">Size:</label>
			<select class="text-black" bind:value={size}>
				{#each sizeOptions as opt}
					<option value={opt.value}>
						{opt.label}
					</option>
				{/each}
			</select>
		</div>
	</div>
</div>
