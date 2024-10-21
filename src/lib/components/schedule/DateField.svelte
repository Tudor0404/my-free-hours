<script lang="ts">
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type DateBlock from '$lib/schedule/values/DateBlock';

	export let block: DateBlock;
	export let onDelete: () => void;
	let operator: Operator = block.operator;
	let betweenStart: number = 1;
	let betweenEnd: number = 31;
	let inDate: number[] = block.values;

	function toggleInSelection(month: number) {
		let index = inDate.indexOf(month);

		if (index == -1) {
			inDate = [...inDate, month];
		} else {
			inDate = [...inDate.slice(0, index), ...inDate.slice(index + 1, inDate.length)];
		}
	}

	$: {
		block.operator = operator;

		if (operator == 'BETWEEN') {
			block.values = [betweenStart, betweenEnd];
		} else {
			block.values = inDate;
		}
	}

	const popupUUID = 'datePopup' + block.uuid;
	const datePopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup'
	};
</script>

<FieldContainer field="Date" bind:operator {onDelete}>
	{#if operator == 'IN'}
		<div class="btn-group-small variant-soft-primary">
			<button type="button" use:popup={datePopup}>
				{#if inDate.length > 0}
					<span>
						{#each inDate.toSorted((e1, e2) => e1 - e2).slice(0, 3) as date, i}
							<span class="font-semibold">
								{date + (i + 1 != inDate.length ? ', ' : '')}
							</span>
						{/each}
						{#if inDate.length > 3}
							<span>...</span>
						{/if}
					</span>
				{/if}
				<Icon icon="tabler:plus"></Icon></button
			>
		</div>

		<div class="z-10 p-2 shadow-xl card" data-popup={popupUUID}>
			<div class="!grid grid-cols-7 gap-0.5">
				{#each Array.from({ length: 31 }, (v, i) => i + 1) as d}
					<button
						class={'btn btn-sm py-0.5 w-[35px]  ' +
							(inDate.indexOf(d) != -1
								? 'variant-filled'
								: 'variant-outline hover:variant-soft-primary')}
						on:click={() => toggleInSelection(d)}
						type="button">{d}</button
					>
				{/each}
			</div>
			<button
				class="absolute -top-3 -right-3 w-6 h-6 shadow-lg btn-icon variant-filled-error close-popup"
				type="button"
			>
				<Icon icon="tabler:x" />
			</button>
		</div>
	{:else if operator == 'BETWEEN'}
		<div class="h-6 btn-group-small variant-soft-primary">
			<button
				type="button"
				disabled={betweenStart == 1}
				on:click={() => (betweenStart = betweenStart - 1)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button">
				<span class="text-sm font-semibold w-[20px]">{betweenStart}</span>
			</button>
			<button
				type="button"
				disabled={betweenEnd == betweenStart}
				on:click={() => (betweenStart = betweenStart + 1)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
		<span>and</span>

		<div class="h-6 btn-group-small variant-soft-primary">
			<button
				type="button"
				disabled={betweenEnd == betweenStart}
				on:click={() => (betweenEnd = betweenEnd - 1)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button">
				<span class="text-sm font-semibold w-[20px]">{betweenEnd}</span>
			</button>
			<button
				type="button"
				disabled={betweenEnd == 31}
				on:click={() => (betweenEnd = betweenEnd + 1)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
	{/if}
</FieldContainer>
