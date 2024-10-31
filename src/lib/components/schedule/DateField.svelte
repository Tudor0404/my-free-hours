<script lang="ts">
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type DateBlock from '$lib/schedule/values/DateBlock';
	import AddMultiple from '../buttons/AddMultiple.svelte';
	import CarrouselButtonGroup from '../buttons/CarrouselButtonGroup.svelte';

	export let block: DateBlock;
	export let onDelete: () => void;
	export let readOnly: boolean = false;
	let operator: Operator = block.operator;
	let betweenStart: number = 1;
	let betweenEnd: number = 31;
	let inDate: number[] = block.values;

	function toggleInSelection(date: number) {
		let index = inDate.indexOf(date);

		if (index == -1) {
			inDate = [...inDate, date];
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

<FieldContainer field="Date" bind:operator {onDelete} {readOnly}>
	{#if operator == 'IN'}
		<div use:popup={datePopup}>
			<AddMultiple values={inDate.toSorted((e1, e2) => e1 - e2)} />
		</div>

		<div class="z-10 p-2 shadow-xl card" data-popup={popupUUID}>
			<div class="!grid grid-cols-7 gap-0.5">
				{#each Array.from({ length: 31 }, (v, i) => i + 1) as d}
					<button
						disabled={readOnly}
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
		<CarrouselButtonGroup
			value={betweenStart}
			onLeftClick={() => (betweenStart = betweenStart - 1)}
			leftDisabled={betweenStart == 1}
			onRightClick={() => (betweenStart = betweenStart + 1)}
			rightDisabled={betweenEnd == betweenStart}
			{readOnly}
		/>
		<span>and</span>
		<CarrouselButtonGroup
			value={betweenEnd}
			onLeftClick={() => (betweenEnd = betweenEnd - 1)}
			leftDisabled={betweenEnd == betweenStart}
			onRightClick={() => (betweenEnd = betweenEnd + 1)}
			rightDisabled={betweenEnd == 31}
			{readOnly}
		/>
	{/if}
</FieldContainer>
