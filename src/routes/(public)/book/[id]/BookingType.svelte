<script lang="ts">
	import { ListBox, ListBoxItem, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import type { Booking } from '$types/Booking';
	import type { HoursMinutes } from '$types/HoursMinutes';
	import { durationToString, getAllPossibleTimes, timeOp } from '$lib/utils/time';

	export let bookings: Booking[];

	let allDurations: HoursMinutes[] = getAllPossibleTimes(bookings);

	let selectedType: number = 0;
	let selectedDuration: number = 0;
	let selectedMethod: 'online' | 'inPerson' = bookings[0].inPerson ? 'inPerson' : 'online';

	// Ensures the selected duration is valid when switching booking types
	$: {
		if (
			bookings[selectedType].durations.findIndex((other) =>
				timeOp(other, '=', allDurations[selectedDuration])
			) == -1
		) {
			selectedDuration = allDurations.findIndex((other) =>
				timeOp(other, '=', bookings[selectedType].durations[0])
			);
		}

		if (selectedMethod == 'online' && !bookings[selectedType].online) {
			selectedMethod = 'inPerson';
		} else if (selectedMethod == 'inPerson' && !bookings[selectedType].inPerson) {
			selectedMethod = 'online';
		}
	}
</script>

<div class="flex flex-col gap-4 justify-start items-start w-full md:flex-row md:justify-start">
	<div class="space-y-2 w-full md:w-fit">
		<!-- <h3>Type</h3> -->

		<RadioGroup class="[&>*]:select-none w-full md:w-[350px]" flexDirection="flex-col">
			{#each bookings as booking, i}
				<RadioItem bind:group={selectedType} name={booking.name} value={i} class="token">
					{booking.name}
				</RadioItem>
			{/each}
		</RadioGroup>
	</div>

	<div class="flex-1 w-full">
		<!-- <h3>Duration</h3> -->
		<RadioGroup class="[&>*]:select-none w-full" flexDirection="md:flex-col flex-row">
			{#each allDurations as duration, i}
				<RadioItem
					bind:group={selectedDuration}
					name="justify"
					value={i}
					disabled={bookings[selectedType].durations.findIndex((other) =>
						timeOp(other, '=', duration)
					) == -1}>{durationToString(duration)}</RadioItem
				>
			{/each}
		</RadioGroup>
	</div>
	<div class="flex-1 w-full">
		<!-- <h3>Duration</h3> -->
		<RadioGroup class="[&>*]:select-none w-full" flexDirection="md:flex-col flex-row">
			<RadioItem
				bind:group={selectedMethod}
				name="justify"
				value={'online'}
				disabled={!bookings[selectedType].online}>Online</RadioItem
			>
			<RadioItem
				bind:group={selectedMethod}
				name="justify"
				value={'inPerson'}
				disabled={!bookings[selectedType].inPerson}>In-person</RadioItem
			>
		</RadioGroup>
	</div>
</div>
