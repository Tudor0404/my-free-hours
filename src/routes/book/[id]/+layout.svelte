<script>
	import { onMount } from 'svelte';
	import { appBarSubTitle } from '../../../stores/appbar';

	onMount(() => {
		appBarSubTitle.set('Book a meeting with NAME');

		return () => {
			appBarSubTitle.set('');
		};
	});
</script>

<div
	class="container h-full mx-auto flex flex-col justify-start items-start px-8 md:px-16 py-4 space-y-8 max-w-xl md:max-w-4xl bg-black/5"
>
	<slot />
</div>
