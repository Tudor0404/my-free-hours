<script lang="ts">
	import { onMount } from 'svelte';
	import AirDatepicker from 'air-datepicker';
	import localeEn from 'air-datepicker/locale/en';
	import type { Day } from '$types/Day';
	import dayjs from 'dayjs';
	import { singleOrFirstDayjs, timeToString } from '$utils/time';
	import DateBadge from './DateBadge.svelte';

	export let days: Day[];
	days = days.sort((d1, d2) => d1.day.getMilliseconds() - d2.day.getMilliseconds());

	let selectedDate: number = 0;
	let selectedTime: number = 0;

	onMount(() => {
		new AirDatepicker('#calendar', {
			inline: true,
			locale: localeEn,
			visible: true,
			range: false,
			selectedDates: [days[0].day],
			minDate: days[0].day,
			maxDate: days[days.length - 1].day,
			firstDay: 1,
			toggleSelected: false,
			onSelect: ({ date }) => {
				selectedDate = days.findIndex((d) =>
					dayjs(d.day).isSame(dayjs(singleOrFirstDayjs(date)), 'days')
				);
				selectedTime = 0;
			},
			onRenderCell: ({ date, cellType }) => {
				if (cellType !== 'day') {
					return {};
				}

				let index = days.findIndex((d) => dayjs(d.day).isSame(date, 'day'));
				if (index === -1) {
					return {
						disabled: true
					};
				}

				let availableTimeCount = days[index].availableTimes.length;

				if (availableTimeCount <= 3) {
					return {
						classes: '!bg-error-300 hover:!bg-error-500 !text-error-900 hover:!text-on-error-token'
					};
				} else if (availableTimeCount <= 5) {
					return {
						classes:
							'!bg-warning-300 hover:!bg-warning-500 !text-warning-900 hover:!text-on-warning-token'
					};
				} else {
					return {
						classes:
							'!bg-success-300 hover:!bg-success-500 !text-success-900 hover:!text-on-success-token'
					};
				}
			}
		});
	});
</script>

<svelte:head>
	<link
		href=" https://cdn.jsdelivr.net/npm/air-datepicker@3.4.0/air-datepicker.min.css"
		rel="stylesheet"
	/>
</svelte:head>

<div class="w-full flex flex-col md:flex-row justify-start items-start gap-4">
	<div
		id="calendar"
		class="flex flex-row justify-center md:justify-start w-full md:w-fit calendar-full"
	></div>
	<div class="w-full flex flex-col items-end">
		<div
			class="flex flex-wrap flex-row justify-center md:justify-end items-start gap-2 h-fit w-full"
		>
			{#each days[selectedDate].availableTimes as time, i}
				<button
					type="button"
					class={`btn ${selectedTime == i ? 'variant-filled' : 'variant-ghost'} hover:variant-filled w-[110px]`}
					on:click={() => (selectedTime = i)}>{timeToString(time)}</button
				>
			{/each}
		</div>
	</div>
</div>
