<script lang="ts">
	import Icon from '@iconify/svelte';

	let buttonClass: string;
	export { buttonClass as class };
	export let text: string;
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" class={`btn ${buttonClass}`} data-sveltekit-preload-data="hover">
	<div class="relative">
		<Icon
			icon="tabler:loader-2"
			class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 animate-spin h-full aspect-square"
		/>
		<span class="text-transparent">{text}</span>
	</div>
</a>
