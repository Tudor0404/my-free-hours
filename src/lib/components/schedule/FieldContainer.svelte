<script lang="ts">
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import DeleteRule from '../buttons/DeleteRule.svelte';

	export let field: string;
	export let operator: Operator = 'IN';
	export let operatorChangeable: boolean = true;
	export let onDelete: (() => void) | null = null;
</script>

<div class="flex flex-row gap-2 justify-start items-center w-full h-scd">
	<div class="flex flex-row gap-1 justify-start items-center">
		<div class="w-4 h-0.5 bg-primary-200" />
		<span class="">
			{field}
		</span>
		<button
			class={`flex flex-row gap-1 justify-start items-center px-0.5  ${operatorChangeable ? 'border-b-tertiary-400 border-y-2 border-t-transparent' : ''}`}
			type="button"
			disabled={!operatorChangeable}
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
	<div class="flex-grow h-0.5 rounded-md bg-primary-100/20"></div>
	<DeleteRule {onDelete} />
</div>
