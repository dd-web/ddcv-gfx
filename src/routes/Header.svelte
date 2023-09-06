<script>
	import { page } from '$app/stores';
</script>

<header class="bg-neutral-900 flex h-12 px-4 drop-shadow-md">
	<div class="flex flex-col justify-center">
		<a href="/"> * </a>
	</div>

	<nav class="mx-auto">
		<ul class="flex gap-6 h-full items-center">
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
			<li aria-current={$page.url.pathname === '/editor' ? 'page' : undefined}>
				<a href="/editor">Editor</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	li a {
		@apply text-lg;
	}

	li[aria-current='page'] {
		@apply font-bold text-amber-300;
	}

	li:not([aria-current='page']):hover {
		@apply text-amber-200;
	}
</style>
