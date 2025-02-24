<script lang="ts">
	import Schedule from '$lib/schedule/Schedule';
	import dayjs from 'dayjs';
	import Condition from './Condition.svelte';
	import SveltyPicker from 'svelty-picker';
	import { onMount } from 'svelte';
	import { timeToMilitaryString } from '$lib/utils/time';
	import type { Database } from '$types/database.types';
	import ConditionBlock from '$lib/schedule/ConditionBlock';

	export let schedule: Schedule = new Schedule();
	let selectedPreview: string;
	$: selectedTimes = schedule.get_times_at_day(dayjs(selectedPreview));
	let datepickerContainer: HTMLElement;

	export let scheduleCallback: ((data: string) => void) | undefined = undefined;
	export let readOnly: boolean = false;
	export let schedules: Database['public']['Tables']['schedule']['Row'][] | null = [];

	function changeCallback() {
		if (scheduleCallback) {
			scheduleCallback(JSON.stringify(schedule.encode_json()));
		}
	}

	let counter = 1;


	function setRoot(block: ConditionBlock) {
		schedule.root = block;
		changeCallback();
		console.log(JSON.stringify(schedule.encode_json()));
		counter++;
	}

	onMount(() => {
		const button = datepickerContainer.querySelector('.sdt-clear-btn') as HTMLButtonElement | null;

		if (button) {
			button.textContent = 'Refresh';
		}
	});


</script>

<div class="flex flex-col gap-4 p-2 shadow-inner card">
	<div>
		<span class="underline">Schedule</span>
		<Condition
			{readOnly}
			bind:condition={schedule.root}
			changeCallback={() => changeCallback()}
			{schedules}
			{setRoot}
		/>
	</div>

	<div class="grid grid-cols-2 gap-4 w-fit">
		<span class="underline">Date preview</span>
		<span class="underline">Time preview of selected date</span>
		<div bind:this={datepickerContainer}>
			<SveltyPicker

				bind:value={selectedPreview}
				disableDatesFn={(date) => schedule.get_times_at_day(dayjs(date)).length == 0}
				pickerOnly
				todayBtn={false}
				clearBtn={!readOnly}
				startDate={new Date()}
			/>
		</div>
		<div class="flex flex-wrap gap-2 h-fit w-[1px] min-w-full">
			{#if selectedPreview}
				{#each selectedTimes as time}
					<span class="text-sm chip variant-outline-tertiary h-fit"
					>{timeToMilitaryString(time.start)} - {timeToMilitaryString(time.end)}</span
					>
				{/each}
			{:else}
				<span class="text-sm chip variant-outline-warning h-fit">None found</span>
			{/if}
		</div>
	</div>
</div>
