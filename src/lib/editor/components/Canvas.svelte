<script>
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	/** @type {HTMLCanvasElement?} */
	export let elementRef = null;
	export let canvasHeight = 0;
	export let canvasWidth = 0;

	/** @type {any[]}*/
	export let entities = [];

	/** @type {Vector2D} - axis offset via panning/moving the viewpoert */
	// let canvasOffsetPosition = {
	// 	x: 0,
	// 	y: 0
	// };

	/** Cursor/mouse stats at various points in time */
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
		/** is the user holding down the cursor now? */
		isDown: false
	};

	/** Global canvas session state */
	const canvasData = {
		offset: {
			x: 0,
			y: 0
		},
		scale: 1,
		bgColor: 'rgba(0, 0, 0, 0.8'
	};

	// $: console.log('scale:', canvasOffsetScale);
	/** for zoom in/out */
	// let canvasOffsetScale = 1;

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
	 * awaiting this fn allows us to prioritize the main thread, requesting animation frames
	 * only when the main thread is free
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

		const time = performance.now();

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = canvasData.bgColor;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		for (let entity of entities) {
			if (entity.type === 'image') {
				let en_Scale = entity.ratios.width + entity.ratios.height / 2;
				let cn_Width = (entity.size.width / en_Scale) * canvasData.scale;
				let cn_Height = (entity.size.height / en_Scale) * canvasData.scale;
				let cn_X = canvasWidth / 2 - cn_Width / 2 - canvasData.offset.x;
				let cn_Y = canvasHeight / 2 - cn_Height / 2 - canvasData.offset.y;

				ctx.drawImage(entity.img, cn_X, cn_Y, cn_Width, cn_Height);
			}
		}

		frame = window.requestAnimationFrame(() => draw(time));
		await prioritizeMainThread();
	}

	/** @param {any} e */
	function onMouseMove(e) {
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

		canvasData.scale =
			delta > 0
				? canvasData.scale >= 5
					? 5
					: parseFloat((canvasData.scale + 0.1).toFixed(2))
				: canvasData.scale <= 0.25
				? 0.25
				: parseFloat((canvasData.scale - 0.1).toFixed(2));
	}

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
	<div class="absolute top-0 left-0 ml-2 text-black z-10">
		<label for="zoom">zoom {canvasData.scale.toFixed(2)}x</label>
	</div>
	<canvas
		id="canvas"
		bind:this={elementRef}
		height={canvasHeight}
		width={canvasWidth}
		on:wheel|passive={onWheel}
		on:mousedown={onStartDrag}
		on:mouseup={onEndDrag}
		on:mousemove={onMouseMove}
	>
		Your browser does not support the HTML5 canvas tag.
	</canvas>
</div>
