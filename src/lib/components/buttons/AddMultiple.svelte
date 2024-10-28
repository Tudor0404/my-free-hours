<script lang="ts">
	import Icon from '@iconify/svelte';

	export let values: any[];
</script>

<button type="button" {...$$restProps} class="btn-schedule">
	{#if values.length > 0}
		<span>
			{#each values.slice(0, 3) as date, i}
				<span class="font-semibold">
					{date + (i + 1 != values.length ? ', ' : '')}
				</span>
			{/each}
			{#if values.length > 3}
				<span>...</span>
			{/if}
		</span>
	{/if}
	<Icon icon="tabler:plus"></Icon></button
>
