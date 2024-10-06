<script lang="ts">
	import { ListBox, ListBoxItem, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import type { Booking } from 'types/Booking';
	import type { HoursMinutes } from 'types/Duration';
	import { areDurationsEqual, durationToString, getAllPossibleDurations } from '../../utils/time';

	export let bookings: Booking[];

	let allDurations: HoursMinutes[] = getAllPossibleDurations(bookings);

	let selectedType: number = 0;
	let selectedDuration: number = 0;
	let selectedMethod: 'online' | 'inPerson' = bookings[0].inPerson ? 'inPerson' : 'online';

	// Ensures the selected duration is valid when switching booking types
	$: {
		if (
			bookings[selectedType].durations.findIndex((other) =>
				areDurationsEqual(other, allDurations[selectedDuration])
			) == -1
		) {
			selectedDuration = allDurations.findIndex((other) =>
				areDurationsEqual(other, bookings[selectedType].durations[0])
			);
		}

		if (selectedMethod == 'online' && !bookings[selectedType].online) {
			selectedMethod = 'inPerson';
		} else if (selectedMethod == 'inPerson' && !bookings[selectedType].inPerson) {
			selectedMethod = 'online';
		}
	}
</script>

<div class="flex flex-col justify-start items-start w-full gap-4 md:flex-row md:justify-start">
	<div class="space-y-2 w-full md:w-fit">
		<!-- <h3>Type</h3> -->

		<RadioGroup class="[&>*]:select-none w-full md:w-[350px]" flexDirection="flex-col">
			{#each bookings as booking, i}
				<RadioItem bind:group={selectedType} name={booking.name} value={i} class="token">
					{booking.name}
				</RadioItem>
			{/each}
		</RadioGroup>

		<!-- {#if !bookings[selectedType].inPerson}
			<div class="flex justify-start items-center flex-row gap-2 text-warning-800">
				<Icon icon="material-symbols:info-outline" class="w-6 h-6" />
				<p>
					This type only allows
					<strong>online</strong> meetings
				</p>
			</div>
		{:else if !bookings[selectedType].online}
			<div class="flex justify-start items-center flex-row gap-2 text-warning-800">
				<Icon icon="material-symbols:info-outline" class="w-6 h-6" />
				<p>
					This type only allows
					<strong>in-person</strong> meetings
				</p>
			</div>
		{/if} -->
	</div>

	<div class="w-full flex-1">
		<!-- <h3>Duration</h3> -->
		<RadioGroup class="[&>*]:select-none w-full" flexDirection="md:flex-col flex-row">
			{#each allDurations as duration, i}
				<RadioItem
					bind:group={selectedDuration}
					name="justify"
					value={i}
					disabled={bookings[selectedType].durations.findIndex((other) =>
						areDurationsEqual(other, duration)
					) == -1}>{durationToString(duration)}</RadioItem
				>
			{/each}
		</RadioGroup>
	</div>
	<div class="w-full flex-1">
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
