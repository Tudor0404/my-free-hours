<script lang="ts">
	import type { Operator } from '$types/Schedule.Operator';
	import Icon from '@iconify/svelte';
	import FieldContainer from './FieldContainer.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type MonthBlock from '$lib/schedule/values/MonthBlock';

	export let block: MonthBlock;
	export let onDelete: () => void;
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

<FieldContainer field="Month" bind:operator {onDelete}>
	{#if operator == 'IN'}
		<div class="btn-group-small variant-soft-primary">
			<button type="button" use:popup={monthPopup}>
				{#if inMonths.length > 0}
					<span>
						{#each inMonths.toSorted((e1, e2) => e1 - e2).slice(0, 3) as month, i}
							<span class="font-semibold">
								{monthNumToString(month) + (i + 1 != inMonths.length ? ', ' : '')}
							</span>
						{/each}
						{#if inMonths.length > 3}
							<span>...</span>
						{/if}
					</span>
				{/if}
				<Icon icon="tabler:plus"></Icon></button
			>
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
		<div class="h-6 btn-group-small variant-soft-primary">
			<button
				type="button"
				disabled={betweenStart == 0}
				on:click={() => (betweenStart = betweenStart - 1)}
			>
				<Icon icon="tabler:chevron-left" />
			</button>
			<button type="button">
				<span class="text-sm font-semibold w-[40px]">{monthNumToString(betweenStart)}</span>
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
				<span class="text-sm font-semibold w-[40px]">{monthNumToString(betweenEnd)}</span>
			</button>
			<button
				type="button"
				disabled={betweenEnd == 11}
				on:click={() => (betweenEnd = betweenEnd + 1)}
			>
				<Icon icon="tabler:chevron-right" />
			</button>
		</div>
	{/if}
</FieldContainer>
