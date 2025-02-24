<script lang="ts">
	import Icon from '@iconify/svelte';

	export let onDuplicate: (() => void) | undefined;
	export let height: string = 'h-6';

</script>

<button
	on:click={onDuplicate}
	type="button"
	class={'p-1 aspect-square btn btn-sm  variant-soft-tertiary ' + height}
>
	<Icon icon="tabler:copy" class="w-full h-full text-tertiary-800" />
</button>
