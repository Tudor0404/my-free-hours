<script lang="ts">
	import type DayOfWeekBlock from '$lib/schedule/values/DayOfWeekBlock';
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import AddMultiple from '../input/buttons/AddMultiple.svelte';
	import CarrouselButtonGroup from '../input/buttons/CarrouselButtonGroup.svelte';

	export let block: DayOfWeekBlock;
	export let onDelete: () => void;
	export let readOnly: boolean = false;
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

	const popupUUID = 'weekDayPopup' + block.uuid;
	const weekDayPopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup'
	};
</script>

<FieldContainer field="Week day" bind:operator {onDelete} {readOnly}>
	{#if operator == 'IN'}
		<div use:popup={weekDayPopup}>
			<AddMultiple
				values={inDays
					.toSorted((e1, e2) => ((e1 + 6) % 7) - ((e2 + 6) % 7))
					.map((e) => weekDayNumToString(e))}
			/>
		</div>

		<div class="absolute z-10 p-2 mx-2 space-x-1 shadow-xl card" data-popup={popupUUID}>
			{#each [1, 2, 3, 4, 5, 6, 0] as d}
				<button
					disabled={readOnly}
					class={'btn btn-sm py-0.5 w-[35px]  ' +
						(inDays.indexOf(d) != -1
							? 'variant-filled'
							: 'variant-outline hover:variant-soft-primary')}
					on:click|preventDefault|stopPropagation={() => toggleInSelection(d)}
					type="button">{weekDayNumToString(d)}</button
				>
			{/each}
			<button
				class="absolute -top-3 -right-3 w-6 h-6 shadow-lg btn-icon variant-filled-error close-popup"
				type="button"
			>
				<Icon icon="tabler:x" />
			</button>
		</div>
	{:else if operator == 'BETWEEN'}
		<CarrouselButtonGroup
			value={weekDayNumToString(betweenStart)}
			onLeftClick={() => (betweenStart = (betweenStart + 6) % 7)}
			leftDisabled={betweenStart == 1}
			onRightClick={() => (betweenStart = (betweenStart + 1) % 7)}
			rightDisabled={betweenEnd == betweenStart}
			{readOnly}
		/>

		<span>and</span>

		<CarrouselButtonGroup
			value={weekDayNumToString(betweenEnd)}
			onLeftClick={() => (betweenEnd = (betweenEnd + 6) % 7)}
			leftDisabled={betweenEnd == betweenStart}
			onRightClick={() => (betweenEnd = (betweenEnd + 1) % 7)}
			rightDisabled={betweenEnd == 0}
			{readOnly}
		/>
	{/if}
</FieldContainer>
