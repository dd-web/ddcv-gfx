<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Caret from '$lib/images/icons/Caret.svelte';
	import ArrowPtr from '$lib/images/icons/ArrowPtr.svelte';
	import EyeOpen from '$lib/images/icons/EyeOpen.svelte';
	import EyeSlash from '$lib/images/icons/EyeSlash.svelte';

	/** @type {Entity} */
	export let ent;

	/** @type {boolean} - more specific and detailed layer information & settings */
	let expanded = false;

	/** toggles expanded layer info panel section */
	function toggle() {
		expanded = !expanded;
	}

	/** @param {any} e */
	function onOpacityChange(e) {
		dispatch('opacity', { id: ent.id, opacity: e?.target?.value });
	}
</script>

<li>
	<div class="flex items-center justify-between bg-zinc-800 gap-2 my-1 mx-2 px-2 py-1 rounded">
		<!-- Layer number / selection indicator / layer selection button -->
		<button
			on:click={() => dispatch('select', ent.id)}
			id="layer-number"
			class:layer-is-selected={ent.selected}
			class:layer-not-selected={!ent.selected}
			class="relative inline-table align-middle h-6 w-6 rounded-full"
		>
			<span class="text-xs align-middle text-center block">
				{ent.zIndex}

				{#if ent.selected}
					<span id="selected-arrow" class="fill-white absolute -bottom-0.5 -right-0.5">
						<ArrowPtr class="h-2.5" />
					</span>
				{/if}
			</span>
		</button>

		<!-- Layer reordering buttons move up/down -->
		<div>
			<button class="rotate-0" on:click={() => dispatch('up', ent.id)}>
				<Caret />
			</button>
			<button class=" rotate-180" on:click={() => dispatch('down', ent.id)}>
				<Caret />
			</button>
		</div>

		<!-- Layer visibility button -->
		<div>
			<button
				id="layer-vis"
				class:vis-off={!ent.visible}
				on:click={() => dispatch(ent.visible ? 'hide' : 'show', ent.id)}
			>
				{#if ent.visible}
					<EyeOpen />
				{:else}
					<EyeSlash />
				{/if}
			</button>
		</div>

		<!-- Layer details expand/compress -->
		<div>
			<button class="fill-white rounded -rotate-90" class:expanded on:click={toggle}>
				<Caret />
			</button>
		</div>
	</div>

	{#if expanded}
		<div class="mx-3 px-4 rounded bg-zinc-800/50">
			<div class="flex items-center justify-between gap-2">
				<label for="layer-opacity">A: </label>
				<input
					class="w-full"
					bind:value={ent.opacity}
					on:input={onOpacityChange}
					type="range"
					name="layer alpha"
					id="layer-opacity"
					min="0"
					max="1"
					step="0.05"
				/>
			</div>
			<div>
				<slot />
			</div>
		</div>
	{/if}
</li>

<style>
	.expanded {
		@apply rotate-180;
	}

	.vis-off {
		@apply fill-white/50;
	}

	.layer-is-selected {
		@apply bg-blue-400;
	}

	.layer-not-selected {
		@apply bg-zinc-600;
	}

	button {
		@apply fill-white bg-zinc-700 rounded px-0.5;
	}

	button#layer-number {
		@apply rounded-full;
	}

	:gloabl(#selected-arrow svg) {
		@apply h-1 w-1;
	}

	:global(#layer-vis svg) {
		@apply p-[0.15rem] w-4;
	}

	:global(#layer-select svg) {
		@apply p-[0.25rem];
	}
</style>
