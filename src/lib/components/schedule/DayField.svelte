<script lang="ts">
	import type DayBlock from '$lib/schedule/values/DayBlock';
	import type { Dayjs } from 'dayjs';
	import FieldContainer from './FieldContainer.svelte';
	import type { Operator } from '$types/Schedule.Operator';
	import dayjs from 'dayjs';
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { flip } from '@floating-ui/dom';

	export let block: DayBlock;
	export let onDelete: () => void;
	export let readOnly: boolean = false;

	let operator: Operator = block.operator;
	let betweenStart = block.values[0].startOf('day');
	let betweenEnd = block.values[1].startOf('day');
	let betweenStartInput = betweenStart.format('YYYY-MM-DD');
	let betweenEndInput = betweenEnd.format('YYYY-MM-DD');
	let inDaysNew: string;
	let inDays: Dayjs[] = block.values;
	let isPopupOpen: boolean = false;

	const popupUUID = 'datePopup' + block.uuid;
	const dayPopup: PopupSettings = {
		event: 'click',
		target: popupUUID,
		placement: 'top',
		closeQuery: '.close-popup',
		state: (e) => (isPopupOpen = e.state),
		middleware: { flip }
	};

	// function toggleInSelection(day: Dayjs) {
	// 	let index = inDays.findIndex((d) => d.startOf('day').isSame(day));

	// 	if (index == -1) {
	// 		inDays = [...inDays, day];
	// 	} else {
	// 		inDays = [...inDays.slice(0, index), ...inDays.slice(index + 1, inDays.length)];
	// 	}
	// }

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

<FieldContainer field="Day" bind:operator {onDelete} {readOnly}>
	{#if operator == 'IN'}
		<button
			type="button"
			use:popup={dayPopup}
			class="px-1 py-1 btn btn-sm variant-outline-tertiary hover:variant-filled-tertiary"
		>
			<span>{inDays.length} {inDays.length == 1 ? 'day' : 'days'}</span>

			<div class={`transition-all duration-150' ${isPopupOpen ? 'rotate-180' : 'rotate-0'}`}>
				<Icon icon="tabler:chevron-up" />
			</div>
		</button>

		<div
			class="z-10 justify-start items-stretch p-2 shadow-xl card w-[220px]"
			data-popup={popupUUID}
		>
			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-1">
					<input
						type="date"
						class="px-0.5 py-0.5 h-8 text-sm input w-fit"
						bind:value={inDaysNew}
						min={dayjs().format('YYYY-MM-DD')}
						disabled={readOnly}
					/>
					<button
						class="w-full btn btn-sm variant-outline-success hover:variant-filled-tertiary"
						type="button"
						disabled={readOnly}
						on:click={() => {
							let newDay = dayjs(inDaysNew, 'YYYY-MM-DD', true);

							if (newDay.isValid()) {
								if (inDays.findIndex((d) => d.isSame(newDay)) == -1) {
									inDays = [...inDays, newDay];
								}
								inDaysNew = '';
							}
						}}>Add</button
					>
				</div>
				<div class="p-1 space-y-1">
					<span>{inDays.length} Days selected</span>
					<div
						class="max-h-[150px] flex flex-col justify-start items-stretch gap-1 overflow-y-scroll hide-scrollbar"
					>
						{#each inDays as day, i}
							<button
								disabled={readOnly}
								type="button"
								class="justify-between w-full btn btn-sm variant-outline hover:variant-outline-error"
								on:click={() =>
									(inDays = [...inDays.slice(0, i), ...inDays.slice(i + 1, inDays.length)])}
							>
								<span>{day.format('DD/MM/YYYY')}</span>
								<span><Icon icon="tabler:x" /></span>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<button
				class="absolute -top-3 -right-3 w-6 h-6 shadow-lg btn-icon variant-filled-error close-popup"
				type="button"
			>
				<Icon icon="tabler:x" />
			</button>
		</div>
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
	{/if}</FieldContainer
>
