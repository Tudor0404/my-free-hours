<script lang="ts">
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type MonthBlock from '$lib/schedule/values/MonthBlock';
	import CarrouselButtonGroup from '../buttons/CarrouselButtonGroup.svelte';
	import AddMultiple from '../buttons/AddMultiple.svelte';
	import { map } from 'zod';

	export let block: MonthBlock;
	export let onDelete: () => void;
	export let readOnly: boolean = false;
	let operator: Operator = block.operator;
	let betweenStart: number = 0;
	let betweenEnd: number = 11;
	let inMonths: number[] = block.values;

	function monthNumToString(num: number) {
		switch (num) {
			case 0:
				return 'Jan';
			case 1:
				return 'Feb';
			case 2:
				return 'Mar';
			case 3:
				return 'Apr';
			case 4:
				return 'May';
			case 5:
				return 'Jun';
			case 6:
				return 'Jul';
			case 7:
				return 'Aug';
			case 8:
				return 'Sep';
			case 9:
				return 'Oct';
			case 10:
				return 'Nov';
			case 11:
				return 'Dec';
			default:
				return '';
		}
	}

	function toggleInSelection(month: number) {
		let index = inMonths.indexOf(month);

		if (index == -1) {
			inMonths = [...inMonths, month];
		} else {
			inMonths = [...inMonths.slice(0, index), ...inMonths.slice(index + 1, inMonths.length)];
		}
	}

	$: {
		block.operator = operator;

		if (operator == 'BETWEEN') {
			block.values = [betweenStart, betweenEnd];
		} else {
			block.values = inMonths;
		}
	}

	const popupUUID = 'monthPopup' + block.uuid;
	const monthPopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup'
	};
</script>

<FieldContainer field="Month" bind:operator {onDelete} {readOnly}>
	{#if operator == 'IN'}
		<div use:popup={monthPopup}>
			<AddMultiple
				values={inMonths.toSorted((e1, e2) => e1 - e2).map((m) => monthNumToString(m))}
			/>
		</div>

		<div class="z-10 p-2 shadow-xl card" data-popup={popupUUID}>
			<div class="!grid grid-cols-6 grid-rows-2 gap-0.5">
				{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as m}
					<button
						class={'btn btn-sm py-0.5 w-[35px]  ' +
							(inMonths.indexOf(m) != -1
								? 'variant-filled'
								: 'variant-outline hover:variant-soft-primary')}
						on:click={() => toggleInSelection(m)}
						disabled={readOnly}
						type="button">{monthNumToString(m)}</button
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
		<CarrouselButtonGroup
			value={monthNumToString(betweenStart)}
			onLeftClick={() => (betweenStart = betweenStart - 1)}
			leftDisabled={betweenStart == 0}
			onRightClick={() => (betweenStart = betweenStart + 1)}
			rightDisabled={betweenEnd == betweenStart}
			{readOnly}
		/>
		<span>and</span>

		<CarrouselButtonGroup
			value={monthNumToString(betweenEnd)}
			onLeftClick={() => (betweenEnd = betweenEnd - 1)}
			leftDisabled={betweenEnd == betweenStart}
			onRightClick={() => (betweenEnd = betweenEnd + 1)}
			rightDisabled={betweenEnd == 11}
			{readOnly}
		/>
	{/if}
</FieldContainer>
