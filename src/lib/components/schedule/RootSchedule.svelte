<script lang="ts">
	import Schedule from '$lib/schedule/Schedule';
	import dayjs from 'dayjs';
	import Condition from './Condition.svelte';
	import AirDatepicker from 'air-datepicker';
	import localeEn from 'air-datepicker/locale/en';
	import SveltyPicker from 'svelty-picker';
	import { onMount } from 'svelte';
	import { timeToMilitaryString } from '$utils/time';

	let schedule: Schedule = new Schedule();
	let selectedPreview: string;
	$: selectedTimes = schedule.get_times_at(dayjs(selectedPreview));

	let datepickerContainer: HTMLElement;

	function changeCallback() {
		console.log(
			schedule
				.get_times_within(dayjs().startOf('month'), dayjs().startOf('month').add(1, 'month'))
				.map((e) => e.day.format('DD-MM-YYYY'))
		);
	}

	$: {
		schedule.root;
		console.log(schedule.get_object());
	}

	onMount(() => {
		const button = datepickerContainer.querySelector('.sdt-clear-btn') as HTMLButtonElement | null;

		if (button) {
			button.textContent = 'Reset';
		}
	});
</script>

<div class="flex flex-col gap-4 w-full">
	<div>
		<span>Schedule</span>
		<Condition condition={schedule.root} changeCallback={() => changeCallback()} />
	</div>

	<div class="flex flex-col gap-2">
		<span>Preview</span>
		<div class="flex flex-row gap-2">
			<div bind:this={datepickerContainer}>
				<SveltyPicker
					bind:value={selectedPreview}
					disableDatesFn={(date) => schedule.get_times_at(dayjs(date)).length == 0}
					pickerOnly
					todayBtn={false}
				/>
			</div>

			<div class="flex flex-row flex-wrap gap-2">
				{#if selectedPreview}
					{#each selectedTimes as time}
						<span class="text-base chip variant-filled h-fit"
							>{timeToMilitaryString(time.start)} - {timeToMilitaryString(time.end)}</span
						>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
