<script lang="ts">
	import Icon from '@iconify/svelte';

	export let onDelete: (() => void) | undefined;

	export let height: string = 'h-6';
</script>

<button
	on:click={onDelete}
	type="button"
	class={'p-1 aspect-square btn btn-sm  variant-soft-error ' + height}
>
	<Icon icon="tabler:trash" class="w-full h-full text-error-800" />
</button>
