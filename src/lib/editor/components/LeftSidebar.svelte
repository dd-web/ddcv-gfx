<script>
	import { createEventDispatcher } from 'svelte';
	import { idManager } from '$lib/stores/id';
	const dispatch = createEventDispatcher();

	/** @type {HTMLCanvasElement?} */
	export let canvasElement;

	/** @type {HTMLInputElement?}*/
	export let inputElement;

	/** @type {string?} */
	let currentImage = null;

	/** @param {any} event */
	const handleFileChange = (event) => {
		if (!event || !event.target || !event.target.files || !event.target.files[0]) return;
		let file = event.target.files[0];

		let shadowEl = new Image();
		shadowEl.src = URL.createObjectURL(file);

		let imageEntity = {
			id: idManager.id(),
			type: 'image',
			img: shadowEl,
			file_name: file.name,
			size: {
				width: 0,
				height: 0
			},
			ratios: {
				width: 0,
				height: 0
			},
			position: {
				x: 0,
				y: 0
			}
		};

		shadowEl.onload = (e) => {
			imageEntity.size = {
				width: shadowEl.width,
				height: shadowEl.height
			};
			if (canvasElement) {
				imageEntity.ratios = {
					width: shadowEl.width / canvasElement.clientWidth,
					height: shadowEl.height / canvasElement.clientHeight
				};
			}
			currentImage = shadowEl.src;

			dispatch('new-entity', imageEntity);
		};
	};
</script>

<div class="bg-neutral-900 w-full rounded-md h-fill">
	{#if currentImage}
		<div>
			<img src={currentImage} alt="user uploaded" />
		</div>
	{/if}

	<label for="image-upload">Upload an image</label>
	<input
		on:change={handleFileChange}
		bind:this={inputElement}
		type="file"
		name="image-upload"
		id="image-upload"
	/>
</div>
