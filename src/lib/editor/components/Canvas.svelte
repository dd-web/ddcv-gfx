<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	import Mode from './gui/Mode.svelte';

	/** @type {HTMLCanvasElement?} */
	export let elementRef = null;
	export let canvasHeight = 0;
	export let canvasWidth = 0;

	/** @type {any[]} */
	export let entities = [];

	/** Global canvas session state @type {any} */
	export let canvasData;

	/** @type {GUIData} */
	export let guiData;

	/** @type {CursorData} Cursor/mouse stats at various points in time */
	const mCursorData = {
		/** @type {Vector2D} position of the cursor when the user clicked down */
		mStartMove: {
			x: 0,
			y: 0
		},
		/** @type {Vector2D} position of the cursor when the user let go of holding down click */
		mEndMove: {
			x: 0,
			y: 0
		},
		mPosition: {
			x: 0,
			y: 0
		},
		/** is the user holding down the cursor now? */
		isDown: false
	};

	/** @type {any} */
	let frame;

	/** @type {any} */
	let timeout;

	/** @param {number} [delta=0] waits until everything is ready before rendering */
	async function init(delta = 0) {
		if (!elementRef) {
			timeout = setTimeout(() => {
				init(delta + 1 * 2);
			}, delta);
		} else {
			draw();
		}
	}

	/**
	 * This is a trick to prioritize the main thread over animation frames
	 * so they're only rendered when the main thread is free, or taken as available.
	 * @see https://github.com/WICG/scheduling-apis/blob/main/explainers/yield-and-continuation.md
	 * while this implementation has nothing to do with any scheduling APIs,
	 * the execution is similar to the one described in the explainer
	 */
	function prioritizeMainThread() {
		return new Promise((res) => {
			setTimeout(res, 0);
		});
	}

	/** @param {number} delta */
	async function draw(delta = 0) {
		if (!elementRef) return init();
		const ctx = elementRef.getContext('2d');
		if (!ctx) return;

		const fStart = performance.now();

		ctx.save();
		ctx.globalAlpha = 1;

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = canvasData.bgColor;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		/**
		 * Render the staging area
		 * we use 1 here instead of a scale because the staging area's size can be predicted
		 * unlike any random image the user might upload
		 */
		let csn_Width = (canvasData.stage.width / 1) * canvasData.scale;
		let csn_Height = (canvasData.stage.height / 1) * canvasData.scale;

		let csn_X = canvasWidth / 2 - csn_Width / 2 - canvasData.offset.x;
		let csn_Y = canvasHeight / 2 - csn_Height / 2 - canvasData.offset.y;

		ctx.fillStyle = canvasData.stage.color;
		ctx.fillRect(csn_X, csn_Y, csn_Width, csn_Height);

		/** Render entities (if they're visible) */
		for (let entity of entities) {
			ctx.globalAlpha = 1;
			if (!entity.visible) continue;

			/** Localize variables */
			let en_Scale = entity.ratios.width + entity.ratios.height / 2;
			let cn_Width = (entity.size.width / en_Scale) * canvasData.scale;
			let cn_Height = (entity.size.height / en_Scale) * canvasData.scale;
			let cn_X = canvasWidth / 2 - cn_Width / 2 - canvasData.offset.x;
			let cn_Y = canvasHeight / 2 - cn_Height / 2 - canvasData.offset.y;

			ctx.globalAlpha = entity.opacity;

			/** Image layers */
			if (entity.type === 'image') {
				ctx.drawImage(entity.img, cn_X, cn_Y, cn_Width, cn_Height);
			}

			/** Selection visualization */
			if (entity.selected) {
				canvasData.selectionOffset += 0.25;
				ctx.setLineDash([8, 8]);
				ctx.lineDashOffset = canvasData.selectionOffset;
				ctx.strokeRect(cn_X - 1, cn_Y - 1, cn_Width + 2, cn_Height + 2);
			}

			if (canvasData.selectionOffset > 16) {
				canvasData.selectionOffset = 0;
			}
		}

		// use css 'cursor' classes for cursor rendering

		ctx.restore();

		frame = window.requestAnimationFrame(() => draw(fStart));
		await prioritizeMainThread();
	}

	/** @param {any} e */
	function onMouseMove(e) {
		mCursorData.mPosition.x = e.clientX;
		mCursorData.mPosition.y = e.clientY;

		if (mCursorData.isDown) {
			canvasData.offset.x = mCursorData.mStartMove.x - e.clientX + mCursorData.mEndMove.x;
			canvasData.offset.y = mCursorData.mStartMove.y - e.clientY + mCursorData.mEndMove.y;
		}
	}

	/** @param {MouseEvent} e */
	function onStartDrag(e) {
		mCursorData.isDown = true;
		mCursorData.mStartMove.x = e.clientX;
		mCursorData.mStartMove.y = e.clientY;
	}

	/** @param {MouseEvent} e */
	function onEndDrag(e) {
		mCursorData.isDown = false;
		mCursorData.mEndMove.x = canvasData.offset.x;
		mCursorData.mEndMove.y = canvasData.offset.y;
	}

	/** @param {any} e */
	function onWheel(e) {
		let delta = e?.wheelDeltaY || e?.deltaY || 0;

		let scale =
			delta > 0
				? canvasData.scale >= 5
					? 5
					: parseFloat((canvasData.scale + 0.1).toFixed(2))
				: canvasData.scale <= 0.25
				? 0.25
				: parseFloat((canvasData.scale - 0.1).toFixed(2));

		canvasData = { ...canvasData, scale: scale };
	}

	/** onload */
	onMount(() => {
		init();
	});

	onDestroy(() => {
		if (browser) {
			window.cancelAnimationFrame(frame);
			console.log('destroying canvas');
		}
		clearTimeout(timeout);
	});
</script>

<div class="bg-white relative">
	<div class="absolute top-0 left-0 ml-2 mt-2 z-10">
		<div
			class="flex flex-col gap-1 items-center bg-zinc-800 p-2 rounded border border-zinc-600 shadow-md shadow-black/25"
		>
			<label class="text-white text-sm" for="zoom">zoom {canvasData.scale.toFixed(2)}</label>
			<input
				class="w-20"
				type="range"
				min="0.25"
				max="5"
				bind:value={canvasData.scale}
				step="0.1"
			/>
		</div>
	</div>

	<Mode bind:guiData />

	<canvas
		id="canvas"
		class="cursor-none"
		bind:this={elementRef}
		height={canvasHeight}
		width={canvasWidth}
		on:wheel|passive={onWheel}
		on:mousedown={onStartDrag}
		on:mouseup={onEndDrag}
		on:mousemove={onMouseMove}
		class:cursor-pan-up={guiData.toolMode === 'pan' && !mCursorData.isDown}
		class:cursor-pan-down={guiData.toolMode === 'pan' && mCursorData.isDown}
		class:cursor-move-up={guiData.toolMode === 'move' && !mCursorData.isDown}
		class:cursor-move-down={guiData.toolMode === 'move' && mCursorData.isDown}
		class:cursor-scale-up={guiData.toolMode === 'scale' && !mCursorData.isDown}
	>
		Your browser does not support the HTML5 canvas tag.
	</canvas>
</div>

<style>
	.cursor-pan-up {
		cursor: grab;
	}

	.cursor-pan-down {
		cursor: grabbing;
	}

	.cursor-move-up,
	.cursor-move-down {
		cursor: move;
	}

	.cursor-scale-up {
		cursor: crosshair;
	}
</style>
