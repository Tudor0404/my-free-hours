<script lang="ts">
	import type DayOfWeekBlock from '$lib/schedule/values/DayOfWeekBlock';
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import BookingDateTime from '../../../routes/(public)/book/[id]/BookingDateTime.svelte';

	export let block: DayOfWeekBlock;
	export let onDelete: () => void;
	let operator: Operator = block.operator;
	let betweenStart: number = 1;
	let betweenEnd: number = 0;
	let inDays: number[] = block.values;

	function weekDayNumToString(num: number) {
		switch (num) {
			case 0:
				return 'Sun';
			case 1:
				return 'Mon';
			case 2:
				return 'Tue';
			case 3:
				return 'Wed';
			case 4:
				return 'Thu';
			case 5:
				return 'Fri';
			case 6:
				return 'Sat';
			default:
				return '';
		}
	}

	function toggleInSelection(day: number) {
		let index = inDays.indexOf(day);

		if (index == -1) {
			inDays = [...inDays, day];
		} else {
			inDays = [...inDays.slice(0, index), ...inDays.slice(index + 1, inDays.length)];
		}
	}

	$: {
		block.operator = operator;

		if (operator == 'BETWEEN') {
			block.values = [betweenStart, betweenEnd];
		} else {
			block.values = inDays;
		}
	}

	let rand = Math.random() * 10000;

	const weekDayPopup: PopupSettings = {
		event: 'click',
		target: 'weekDayPopup' + rand,
		placement: 'top',
		closeQuery: ''
	};
</script>

<FieldContainer field="Week day" bind:operator {onDelete}>
	{#if operator == 'IN'}
		<div class="btn-group-small variant-soft-primary">
			<button type="button" use:popup={weekDayPopup}>
				{#if inDays.length > 0}
					<span>
						{#each inDays
							.toSorted((e1, e2) => ((e1 + 6) % 7) - ((e2 + 6) % 7))
							.slice(0, 3) as day, i}
							<span class="font-semibold">
								{weekDayNumToString(day) + (i + 1 != inDays.length ? ', ' : '')}
							</span>
						{/each}
						{#if inDays.length > 3}
							<span>...</span>
						{/if}
					</span>
				{/if}
				<Icon icon="tabler:plus"></Icon></button
			>
		</div>

		<div class="absolute z-10 p-2 mx-2 space-x-1 shadow-xl card" data-popup={'weekDayPopup' + rand}>
			{#each [1, 2, 3, 4, 5, 6, 0] as d}
				<button
					class={'btn btn-sm py-0.5 w-[35px]  ' +
						(inDays.indexOf(d) != -1
							? 'variant-filled'
							: 'varaint-soft hover:variant-soft-primary')}
					on:click|preventDefault|stopPropagation={() => toggleInSelection(d)}
					>{weekDayNumToString(d)}</button
				>
			{/each}
		</div>
	{:else if operator == 'BETWEEN'}
		<div class="h-6 btn-group-small variant-soft-primary">
			<button
				type="button"
				disabled={betweenStart == 1}
				on:click={() => (betweenStart = (betweenStart - 1 + 7) % 7)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button">
				<span class="text-sm font-semibold w-[40px]">{weekDayNumToString(betweenStart)}</span>
			</button>
			<button
				type="button"
				disabled={betweenEnd == betweenStart}
				on:click={() => (betweenStart = (betweenStart + 1) % 7)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
		<span>and</span>

		<div class="h-6 btn-group-small variant-soft-primary">
			<button
				type="button"
				disabled={betweenEnd == betweenStart}
				on:click={() => (betweenEnd = (betweenEnd - 1 + 7) % 7)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button">
				<span class="text-sm font-semibold w-[40px]">{weekDayNumToString(betweenEnd)}</span>
			</button>
			<button
				type="button"
				disabled={betweenEnd == 0}
				on:click={() => (betweenEnd = (betweenEnd + 1) % 7)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
	{/if}
</FieldContainer>
