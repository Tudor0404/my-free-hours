<script lang="ts">
	import { ListBox, ListBoxItem, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import type { Booking } from 'types/Booking';
	import type { Duration } from 'types/Duration';
	import {
		areDurationsEqual,
		durationToString,
		getAllPossibleDurations
	} from '../../utils/duration';

	export let bookings: Booking[];

	let allDurations: Duration[] = getAllPossibleDurations(bookings);

	let selectedType: number = 0;
	let selectedDuration: number = 0;

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
	}
</script>

<div class="flex flex-row justify-between items-start w-full">
	<div class="space-y-2">
		<h3>Type</h3>

		<RadioGroup class="[&>*]:select-none w-[350px]" flexDirection="flex-col">
			{#each bookings as booking, i}
				<RadioItem bind:group={selectedType} name={booking.name} value={i}>
					{booking.name}
				</RadioItem>
			{/each}
		</RadioGroup>

		{#if !bookings[selectedType].inPerson}
			<p>This type only allows online meetings</p>
		{:else if !bookings[selectedType].online}
			<p><Icon icon="material-symbols:info-outline" /> This type only allows in-person meetings</p>
		{/if}
	</div>

	<div class="space-y-2">
		<h3>Duration</h3>
		<RadioGroup class="[&>*]:select-none" flexDirection="flex-col">
			{#each allDurations as duration, i}
				{#if bookings[selectedType].durations.findIndex( (other) => areDurationsEqual(other, duration) ) != -1}
					<RadioItem bind:group={selectedDuration} name="justify" value={i}
						>{durationToString(duration)}</RadioItem
					>
				{:else}
					<RadioItem bind:group={selectedDuration} name="justify" value={i} disabled>
						{durationToString(duration)}
					</RadioItem>
				{/if}
			{/each}
		</RadioGroup>
	</div>
</div>
