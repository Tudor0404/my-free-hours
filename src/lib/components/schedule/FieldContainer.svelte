<script lang="ts">
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';

	export let field: string;
	export let operator: Operator = 'IN';
	export let onDelete: (() => void) | null = null;
</script>

<div class="h-scd flex flex-row justify-start items-center gap-2 [&>button]:hover:opacity-100">
	<div class="flex flex-row gap-1 justify-start items-center">
		<div class="w-4 h-0.5 bg-primary-200" />
		<span class="">
			{field}
		</span>
		<button
			class="flex flex-row gap-1 justify-start items-center px-0.5 border-b-primary-200 border-y-2 border-t-transparent"
			type="button"
			on:click={() => {
				if (operator == 'IN') {
					operator = 'BETWEEN';
				} else {
					operator = 'IN';
				}
			}}
		>
			<span class="">{operator == 'BETWEEN' ? 'between' : 'in'}</span>
			<!-- {#if operator == 'IN'}
				<Icon icon="tabler:chevron-up" />
			{:else}
				<Icon icon="tabler:chevron-down" />
			{/if} -->
		</button>
	</div>

	<slot />
	<button
		on:click|stopPropagation|preventDefault={onDelete}
		type="button"
		class="p-1.5 ml-8 w-7 h-7 opacity-0 btn btn-sm variant-soft-error"
	>
		<Icon icon="tabler:trash" class="w-full h-full" />
	</button>
</div>
