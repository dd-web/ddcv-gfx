<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="h-full flex flex-col">
	<Header />

	<main class="h-full bg-neutral-800 flex">
		<slot />
	</main>

	<footer class="bg-neutral-900 h-12 flex flex-col justify-center px-4">
		<p>footer here</p>
	</footer>
</div>

<style>
</style>
