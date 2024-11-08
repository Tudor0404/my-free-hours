<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { number } from 'zod';

	export let value: number[];
	export let step: number = 5;
	export let limit: number = 3;
	export let max: number = 120;

	let newValue: number;

	const toastStore = getToastStore();

	function addValue() {
		if (newValue == null || newValue == 0) {
			toastStore.trigger({
				message: 'Invalid duration!',
				background: 'variant-filled-warning'
			});
			return;
		}
		value = [...value, newValue];
		newValue = 0;
	}

	$: {
		if (newValue < 0) {
			newValue = 0;
		} else if (newValue > max) {
			newValue = max;
		}
	}
</script>

<div class="flex flex-col gap-2 p-4 shadow-inner w-fit card min-w-[150px]">
	{#each value as duration, i}
		<div class="flex flex-row gap-2 justify-start items-stretch">
			<div class="flex justify-center items-center p-1 w-full rounded-sm variant-outline-surface">
				{duration} minutes
			</div>
			<button
				type="button"
				class="btn btn-sm variant-ringed-error"
				on:click={() => (value = [...value.slice(0, i), ...value.slice(i + 1, value.length)])}
			>
				<Icon icon="tabler:trash" />
			</button>
		</div>
	{/each}
	<div class="grid grid-cols-[auto_auto] gap-2 w-fit">
		<input
			class="py-1 input w-[150px] h-full"
			type="number"
			min="0"
			{max}
			{step}
			placeholder="minutes"
			disabled={value.length >= limit}
			bind:value={newValue}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					e.stopPropagation();
					e.preventDefault();
					addValue();
				}
			}}
		/>
		<button
			type="button"
			class="!py-0 my-0.5 w-fit btn btn-sm variant-ringed-success"
			disabled={value.length >= limit}
			on:click={addValue}><Icon icon="tabler:plus" /></button
		>
	</div>
</div>
