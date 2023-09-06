<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Caret from '$lib/images/icons/Caret.svelte';

	/** @type {any} */
	export let ent;
	let expanded = false;

	function toggle() {
		expanded = !expanded;
	}
</script>

<li>
	<div class="flex items-center justify-between gap-2 bg-zinc-800 my-1 mx-2 px-2 py-1 rounded">
		<div
			class="bg-zinc-600 rounded-full grid grid-cols-[1.25rem] grid-rows-[1.25rem] items-center justify-items-center"
		>
			<span class="text-xs">
				{ent.zIndex}
			</span>
		</div>

		<div>
			<button
				class="fill-white bg-zinc-700 rounded px-0.5 rotate-0"
				on:click={() => dispatch('up', ent.id)}
			>
				<Caret />
			</button>
			<button
				class="fill-white bg-zinc-700 rounded px-0.5 rotate-180"
				on:click={() => dispatch('down', ent.id)}
			>
				<Caret />
			</button>
		</div>

		<div>
			<button class="fill-white rounded -rotate-90" class:expanded on:click={toggle}>
				<Caret />
			</button>
		</div>
	</div>

	{#if expanded}
		<div class="mx-3 px-4 rounded bg-zinc-800/50">
			<slot />
		</div>
	{/if}
</li>

<style>
	.expanded {
		@apply rotate-180;
	}
</style>
