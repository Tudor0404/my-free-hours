<script lang="ts">
	import type DayBlock from '$lib/schedule/values/DayBlock';
	import type { Dayjs } from 'dayjs';
	import FieldContainer from './FieldContainer.svelte';
	import type { Operator } from '$types/Schedule.Operator';
	import dayjs from 'dayjs';
	import DateSelect from '../input/multi/DateSelect.svelte';

	export let block: DayBlock;
	export let onDelete: () => void;
	export let onDuplicate: () => void;
	export let readOnly: boolean = false;

	let operator: Operator = block.operator;
	let betweenStart: Dayjs;
	let betweenEnd: Dayjs;
	let betweenStartInput: string;
	let betweenEndInput: string;

	if (block.values.length == 2 && operator == 'BETWEEN') {
		betweenStart = block.values[0].startOf('day');
		betweenEnd = block.values[1].startOf('day');

		betweenStartInput = betweenStart.format('YYYY-MM-DD');
		betweenEndInput = betweenEnd.format('YYYY-MM-DD');
	}
	let inDays: Dayjs[] = block.values;

	$: {
		block.operator = operator;

		if (operator == 'BETWEEN') {
			block.values = [betweenStart, betweenEnd];
		} else {
			block.values = inDays;
		}
	}

	$: {
		betweenStart = dayjs(betweenStartInput, 'YYYY-MM-DD');
		betweenEnd = dayjs(betweenEndInput, 'YYYY-MM-DD');
	}
</script>

<FieldContainer field="Date" bind:operator {onDelete} {readOnly} {onDuplicate}>
	{#if operator == 'IN'}
		<DateSelect bind:days={inDays} disabled={readOnly} />
	{:else if operator == 'BETWEEN'}
		<input
			type="date"
			class="px-0.5 py-0.5 h-8 text-sm input w-fit"
			bind:value={betweenStartInput}
			max={betweenEndInput}
			disabled={readOnly}
		/>
		<span>and</span>
		<input
			type="date"
			class="px-0.5 py-0.5 h-8 text-sm input w-fit variant-outline"
			bind:value={betweenEndInput}
			min={betweenStartInput}
			disabled={readOnly}
		/>
	{/if}
</FieldContainer
>
