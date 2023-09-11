<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	import Mode from './gui/Mode.svelte';

	/** @CONSTANT DEBUG MODE - debug helpers */
	const DEBUGMODE = false;

	/** @type {HTMLCanvasElement?} */
	export let elementRef = null;
	export let canvasHeight = 0;
	export let canvasWidth = 0;

	/** @type {any[]} */
	export let entities = [];

	/** @type {any} Global canvas session state  */
	export let canvasData;

	/** @type {GUIData} */
	export let guiData;

	/** @type {any} */
	export let entityStore;

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
		/** @type {Vector2D} position of the cursor currently */
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

		/** these scales are not setup correctly - still looking into this */
		let cnv_scale_offset_center_x =
			(canvasWidth * canvasData.scale) / 2 -
			canvasData.offset.x -
			(canvasWidth * canvasData.scale) / 2;
		let cnv_scale_offset_center_y =
			(canvasHeight * canvasData.scale) / 2 -
			canvasData.offset.y -
			(canvasHeight * canvasData.scale) / 2;

		ctx.fillStyle = canvasData.stage.color;
		ctx.fillRect(
			cnv_scale_offset_center_x,
			cnv_scale_offset_center_y,
			canvasData.stage.width * canvasData.scale,
			canvasData.stage.height * canvasData.scale
		);

		/** Render entities (if they're visible) */
		for (let entity of entities) {
			/** Reset any changes we've made on other entities */
			if (!entity.visible) continue;

			/**  ensure the image fits in the viewport and is not distorted */
			let ent_scale = Math.min(entity.ratios.width, entity.ratios.height);

			ctx.globalAlpha = entity.opacity;

			/** Image layers */
			if (entity.type === 'image') {
				if (entity.selected && guiData.toolMode === 'move' && mCursorData.isDown) {
					entity.position.x =
						entity.move_offset_position.x - mCursorData.mStartMove.x + mCursorData.mPosition.x;
					entity.position.y =
						entity.move_offset_position.y - mCursorData.mStartMove.y + mCursorData.mPosition.y;
				}

				ctx.drawImage(
					entity.img,
					cnv_scale_offset_center_x + entity.position.x * canvasData.scale,
					cnv_scale_offset_center_y + entity.position.y * canvasData.scale,
					entity.size.width * canvasData.scale * ent_scale,
					entity.size.height * canvasData.scale * ent_scale
				);
			}

			/** Selection visualization */
			if (entity.selected) {
				ctx.globalAlpha = 1;
				canvasData.selectionOffset += 0.25;
				ctx.setLineDash([8, 8]);
				ctx.lineDashOffset = canvasData.selectionOffset;
				ctx.strokeRect(
					cnv_scale_offset_center_x + entity.position.x * canvasData.scale - 1,
					cnv_scale_offset_center_y + entity.position.y * canvasData.scale - 1,
					entity.size.width * ent_scale * canvasData.scale + 2,
					entity.size.height * ent_scale * canvasData.scale + 2
				);
			}

			if (canvasData.selectionOffset > 16) {
				canvasData.selectionOffset = 0;
			}
		}

		ctx.restore();

		frame = window.requestAnimationFrame(() => draw(fStart));
		await prioritizeMainThread();
	}

	/** @param {any} e */
	function onMouseMove(e) {
		mCursorData.mPosition.x = e.clientX;
		mCursorData.mPosition.y = e.clientY;

		if (mCursorData.isDown && guiData.toolMode === 'pan') {
			canvasData.offset.x = mCursorData.mStartMove.x - e.clientX + mCursorData.mEndMove.x;
			canvasData.offset.y = mCursorData.mStartMove.y - e.clientY + mCursorData.mEndMove.y;
		}
	}

	/** @param {MouseEvent} e */
	function onStartDrag(e) {
		mCursorData.isDown = true;
		mCursorData.mStartMove.x = e.clientX;
		mCursorData.mStartMove.y = e.clientY;

		entityStore.cascadeMoveOffset();
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

	/** cleanup */
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
		{#if DEBUGMODE}
			<div>
				<span class="bg-zinc-800">offset x {canvasData.offset.x}</span>
				<span class="bg-zinc-800">offset y {canvasData.offset.y}</span>
			</div>
		{/if}
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
