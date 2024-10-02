<script lang="ts">
	import BookingType from '$lib/components/BookingType.svelte';
	import type { Booking } from 'types/Booking';

	/** @type {import('./$types').PageData} */
	export let data;

	let bookings: Booking[] = [
		{
			durations: [
				{ hours: 1, minutes: 0 },
				{ hours: 0, minutes: 30 },
				{ hours: 0, minutes: 45 }
			],
			name: 'Supervision',
			online: true,
			inPerson: true
		},
		{
			durations: [{ hours: 0, minutes: 30 }],
			name: 'Tutor Meeting',
			online: true,
			inPerson: true
		},
		{
			durations: [
				{ hours: 0, minutes: 30 },
				{ hours: 1, minutes: 30 }
			],
			name: 'Project',
			online: true,
			inPerson: false
		}
	];
</script>

<div class="w-full space-y-6">
	<BookingType {bookings} />

	<div class="space-y-2">
		<h3>Date and Time</h3>
		<div class="grid grid-cols-2"></div>
	</div>
</div>
