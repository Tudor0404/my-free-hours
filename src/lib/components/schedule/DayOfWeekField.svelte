<script lang="ts">
	import type DayOfWeekBlock from '$lib/schedule/values/DayOfWeekBlock';
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';

	export let block: DayOfWeekBlock;
	export let onDelete: () => void;
	let operator: Operator = 'BETWEEN';
	let betweenStart: number = 1;
	let betweenEnd: number = 0;
	let inDays: number[] = [];

	function weekDayNumToStringShort(num: number) {
		switch (num) {
			case 0:
				return 'sun';
			case 1:
				return 'mon';
			case 2:
				return 'tue';
			case 3:
				return 'wed';
			case 4:
				return 'thu';
			case 5:
				return 'fri';
			case 6:
				return 'sat';
			default:
				return '';
		}
	}

	function weekDayNumToString(num: number) {
		console.log(num);
		switch (num) {
			case 0:
				return 'sunday';
			case 1:
				return 'monday';
			case 2:
				return 'tuesday';
			case 3:
				return 'wednesday';
			case 4:
				return 'thursday';
			case 5:
				return 'friday';
			case 6:
				return 'saturday';
			default:
				return '';
		}
	}
</script>

<FieldContainer field="Week day" bind:operator {onDelete}>
	{#if operator == 'IN'}
		IN
	{:else if operator == 'BETWEEN'}
		<div class="h-6 btn-group variant-soft-primary">
			<button
				type="button"
				class="!px-1 !py-0.5 btn btn-sm"
				disabled={betweenStart == 1}
				on:click={() => (betweenStart = (betweenStart - 1 + 7) % 7)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button" class="!px-1 !py-0.5 btn btn-sm">
				<span class="text-sm font-semibold capitalize w-[80px]"
					>{weekDayNumToString(betweenStart)}</span
				>
			</button>
			<button
				type="button"
				class="!px-1 !py-0.5 btn btn-sm"
				disabled={betweenEnd == betweenStart}
				on:click={() => (betweenStart = (betweenStart + 1) % 7)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
		<span> and</span>

		<div class="h-6 btn-group variant-soft-primary">
			<button
				type="button"
				class="!px-1 !py-0.5 btn btn-sm"
				disabled={betweenEnd == betweenStart}
				on:click={() => (betweenEnd = (betweenEnd - 1 + 7) % 7)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button" class="!px-1 !py-0.5 btn btn-sm">
				<span class="text-sm font-semibold capitalize w-[80px]"
					>{weekDayNumToString(betweenEnd)}</span
				>
			</button>
			<button
				type="button"
				class="!px-1 !py-0.5 btn btn-sm"
				disabled={betweenEnd == 0}
				on:click={() => (betweenEnd = (betweenEnd + 1) % 7)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
		<span>.</span>
	{/if}
</FieldContainer>
