<script lang="ts">
	import BookingDateTime from './BookingDateTime.svelte';
	import BookingType from './BookingType.svelte';
	import type { Booking } from '$types/Booking';
	import type { Day } from '$types/Day';

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
			online: false,
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

	let days: Day[] = [
		{
			day: new Date('2024-10-5'),
			workHours: { start: { hours: 9, minutes: 0 }, end: { hours: 17, minutes: 0 } },
			inPerson: true,
			online: true,
			unavailability: [{ start: { hours: 12, minutes: 0 }, end: { hours: 13, minutes: 0 } }],
			availableTimes: [
				{ hours: 9, minutes: 0 },
				{ hours: 9, minutes: 30 },
				{ hours: 10, minutes: 0 },
				{ hours: 10, minutes: 30 },
				{ hours: 12, minutes: 0 },
				{ hours: 12, minutes: 30 },
				{ hours: 13, minutes: 0 },
				{ hours: 13, minutes: 30 }
			]
		},
		{
			day: new Date('2024-10-6'),
			workHours: { start: { hours: 9, minutes: 0 }, end: { hours: 17, minutes: 0 } },
			inPerson: true,
			online: true,
			unavailability: [{ start: { hours: 12, minutes: 0 }, end: { hours: 13, minutes: 0 } }],
			availableTimes: [
				{ hours: 9, minutes: 0 },
				{ hours: 9, minutes: 30 },
				{ hours: 10, minutes: 0 },
				{ hours: 10, minutes: 30 }
			]
		},
		{
			day: new Date('2024-10-10'),
			workHours: { start: { hours: 9, minutes: 0 }, end: { hours: 17, minutes: 0 } },
			inPerson: true,
			online: true,
			unavailability: [{ start: { hours: 12, minutes: 0 }, end: { hours: 13, minutes: 0 } }],
			availableTimes: [
				{ hours: 9, minutes: 0 },
				{ hours: 9, minutes: 30 }
			]
		},
		{
			day: new Date('2024-10-12'),
			workHours: { start: { hours: 9, minutes: 0 }, end: { hours: 17, minutes: 0 } },
			inPerson: true,
			online: true,
			unavailability: [{ start: { hours: 12, minutes: 0 }, end: { hours: 13, minutes: 0 } }],
			availableTimes: [
				{ hours: 9, minutes: 0 },
				{ hours: 9, minutes: 30 }
			]
		},
		{
			day: new Date('2024-11-12'),
			workHours: { start: { hours: 9, minutes: 0 }, end: { hours: 17, minutes: 0 } },
			inPerson: true,
			online: true,
			unavailability: [{ start: { hours: 12, minutes: 0 }, end: { hours: 13, minutes: 0 } }],
			availableTimes: [
				{ hours: 9, minutes: 0 },
				{ hours: 9, minutes: 30 }
			]
		}
	];
</script>

<div class="w-full space-y-6">
	<div class="space-y-2">
		<h3>Booking</h3>
		<BookingType {bookings} />
	</div>

	<div class="space-y-2">
		<h3>Date and time</h3>
		<BookingDateTime {days} />
	</div>
</div>
