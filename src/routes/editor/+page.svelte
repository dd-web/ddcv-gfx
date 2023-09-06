<script>
	import { onMount } from 'svelte';
	import { createEntityStore } from '$lib/stores/entity';
	import LeftSidebar from '$lib/editor/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/editor/components/RightSidebar.svelte';
	import Canvas from '$lib/editor/components/Canvas.svelte';

	/**
	 * Grouped references to DOM elements
	 */
	let refs = {
		/** @type {HTMLCanvasElement?} canvas */
		canvas: null,
		/** @type {HTMLDivElement?} leftSidebar */
		leftSidebar: null,
		/** @type {HTMLDivElement?} rightSidebar */
		rightSidebar: null
	};

	/** @type {HTMLInputElement} */
	let imageInputElement;

	/** @type {Area2D} */
	let screenSize = {
		width: 0,
		height: 0
	};

	/** @type {Area2D} */
	let canvasSize = {
		width: 800,
		height: 600
	};

	/** Canvas runtime values associated with it's internal state that determines what is rendered and where */
	let canvasData = {
		/** @type {Vector2D} canvas position offsets (canvas pan vs entity movement)*/
		offset: {
			x: 0,
			y: 0
		},
		scale: 1,
		bgColor: 'rgba(0, 0, 0, 0.8'
	};

	/** @type {GUIData} */
	let guiData = {
		brushSize: 1,
		brushColor: '#000000'
	};

	const entities = createEntityStore();

	$: $entities ? console.log('entities', $entities) : null;

	/**
	 * Adds a new entity to the list of entities
	 * @param {CustomEvent<any>} entity;
	 */
	function addEntity(entity) {
		entities.addEntity(entity.detail);

		console.log('$entities', $entities);
	}

	onMount(() => {
		let sectionElement = refs?.canvas?.parentElement;
		if (!sectionElement || !refs?.canvas) return;

		let dpr = window.devicePixelRatio || 1;
		console.log('dpr', dpr);

		screenSize = {
			width: sectionElement.clientWidth,
			height: sectionElement.clientHeight
		};

		canvasSize = {
			width: refs.canvas.clientWidth,
			height: refs.canvas.clientHeight
		};

		entities.updateCanvas(refs.canvas);

		console.log('Editor initialized');
	});
</script>

<svelte:head>
	<title>Photo Editor</title>
	<meta name="description" content="Canvas Game Demo" />
</svelte:head>

<section
	class="grid grid-cols-[15rem_1fr_15rem] gap-4 items-center justify-items-center w-fit h-fit m-auto"
>
	<!-- left sidebar -->
	<LeftSidebar
		on:new-entity={addEntity}
		bind:inputElement={imageInputElement}
		bind:canvasElement={refs.canvas}
	/>

	<!-- center (editor) -->
	<Canvas
		bind:entities={$entities}
		bind:elementRef={refs.canvas}
		bind:canvasWidth={canvasSize.width}
		bind:canvasHeight={canvasSize.height}
		bind:canvasData
	/>

	<!-- right sidebar -->
	<RightSidebar bind:guiData entityStore={entities} bind:canvasData />
</section>
