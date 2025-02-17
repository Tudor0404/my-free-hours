<svelte:head>
	<title>MFH: Calendar</title>
</svelte:head>

<script lang="ts">
	import ConditionBlock from '$lib/schedule/ConditionBlock';
	import Schedule from '$lib/schedule/Schedule';
	import TimeBlock from '$lib/schedule/values/TimeBlock.js';
	import { shuffleWithKey } from '$lib/utils/shuffle.js';
	import { createTime, getAbsoluteTime, timeMath, timeToMilitaryString } from '$lib/utils/time.js';
	import type { TimeRange } from '$types/TimeRange';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import List from '@event-calendar/list';
	import dayjs, { type Dayjs } from 'dayjs';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let data;

	const onlineSchedule = Schedule.decode_json(JSON.parse(data.schedules.online_schedule as string));
	const inpersonSchedule = Schedule.decode_json(
		JSON.parse(data.schedules.inperson_schedule as string)
	);
	const availabilitySchedule = new Schedule(
		new ConditionBlock('OR', [onlineSchedule.root, inpersonSchedule.root])
	);
	const unavailableSchedule = new Schedule(new ConditionBlock('NOT', [availabilitySchedule.root]));

	const colours = shuffleWithKey(
		[
			'#9f1239',
			'#9d174d',
			'#86198f',
			'#6b21a8',
			'#5b21b6',
			'#3730a3',
			'#1e40af',
			'#075985',
			'#155e75',
			'#115e59',
			'#065f46',
			'#166534',
			'#3f6212',
			'#854d0e',
			'#92400e',
			'#9a3412',
			'#991b1b'
		],
		data.user?.id || ''
	);

	function getBookingTypeIndex(id: number | null): number {
		return data.booking_types.findIndex((e) => e.id === id);
	}

	function getCalendarProperties(
		start: Dayjs,
		end: Dayjs,
		eventRanges?: TimeRange[]
	): [string, string, number] {
		const slots = availabilitySchedule
			.get_times_within_days(start, end)
			.flatMap((e) => e.times)
			.concat(eventRanges || []);

		const startSorted = [...slots].sort(
			(a, b) => getAbsoluteTime(a.start) - getAbsoluteTime(b.start)
		);
		const endSorted = [...slots].sort((a, b) => getAbsoluteTime(b.end) - getAbsoluteTime(a.end));

		if (startSorted.length == 0) {
			return ['09:00', '16:00', 40];
		}

		const firstTime = createTime(startSorted[0].start.hours, 0);
		const lastTime = createTime(endSorted[0].end.hours, 0);
		const hours = lastTime.hours - firstTime.hours;
		const maxHeight = 300;
		const slotHeight = Math.trunc(Math.min(Math.max(maxHeight / hours, 24), 50));

		return [
			timeToMilitaryString(timeMath(firstTime, '-', createTime(1, 0)) || TimeBlock.EARLIEST_TIME),
			timeToMilitaryString(timeMath(lastTime, '+', createTime(1, 0)) || TimeBlock.LATEST_TIME),
			slotHeight
		];
	}

	const modalStore = getModalStore();
	let ec: any;
	let plugins = [TimeGrid, List];
	let options: any;
	let currentSlotHeight = 50;

	$: if (currentSlotHeight) {
		document.documentElement.style.setProperty('--ec-time-height', `${currentSlotHeight}px`);
	}

	onMount(() => {
		const initialProperties = getCalendarProperties(dayjs().startOf('week'), dayjs().endOf('week'));
		currentSlotHeight = initialProperties[2];

		options = {
			view: 'timeGridWeek',
			allDaySlot: false,
			headerToolbar: {
				start: 'prev,next today',
				center: 'title',
				end: 'timeGridWeek,timeGridDay,listWeek'
			},
			slotMinTime: initialProperties[0],
			slotMaxTime: initialProperties[1],
			firstDay: 1 as Calendar.dayOfWeek,
			nowIndicator: true,
			height: '100%',
			slotHeight: initialProperties[2],
			eventClick: (info: any) => {
				if (info.event.id.startsWith('outlookevent')) {
					return;
				}

				const currentBooking = data.bookings.find((e) => e.id === Number.parseInt(info.event.id));
				const bookingTypeIndex = getBookingTypeIndex(currentBooking?.type_id || null);

				new Promise<boolean>((resolve) => {
					const bookingModal: ModalSettings = {
						type: 'component',
						component: 'Booking',
						meta: {
							id: currentBooking?.id || undefined,
							startTime: dayjs(currentBooking?.start_time),
							duration: currentBooking?.duration,
							guestName: currentBooking?.guest_name,
							guestEmail: currentBooking?.guest_email,
							meetingMethod: currentBooking?.meeting_method,
							createdAt: currentBooking?.created_at,
							meetingType:
								bookingTypeIndex === -1 ? undefined : data.booking_types[bookingTypeIndex].name
						},
						response: (r: boolean) => {
							resolve(r);
						}
					};

					modalStore.trigger(bookingModal);
				}).then((r: any) => {
					if (r) {
						ec.removeEventById(info.event.id);
					}
					invalidate('supabase:db:booking_calendar');
				});
			},
			eventSources: [
				{
					events: (fetchInfo: any, successCallback: any, failureCallback: any) => {
						const start = dayjs(fetchInfo.start).startOf('day');
						const end = dayjs(fetchInfo.end).startOf('day');

						const bookings = data.bookings
							.filter((e) => dayjs(e.start_time).isBetween(start, end))
							.map((e) => {
								const bookingTypeIndex = getBookingTypeIndex(e.type_id);

								return {
									start: dayjs(e.start_time).toDate(),
									end: dayjs(e.start_time)
										.add(e.duration as number, 'minute')
										.toDate(),
									id: e.id,
									title: `${bookingTypeIndex == -1 ? '' : data.booking_types[bookingTypeIndex].name + ' w/ '} ${e.guest_name}`,
									backgroundColor: colours[(bookingTypeIndex + 26) % 26]
								};
							});

						const calendarEvents = data.calendar_events
							.filter((e) => dayjs(e.start_time).isBetween(start, end) && !e.booking_url)
							.map(e => {
								return {
									start: dayjs(e.start_time).toDate(),
									end: dayjs(e.end_time).toDate(),
									id: 'outlookevent' + e.id,
									title: 'Outlook Event',
									backgroundColor: '#808080'
								};
							});

						const unavailability = unavailableSchedule
							.get_times_within_days(start, end)
							.flatMap((e) => {
								return e.times.map((t) => {
									return {
										start: e.day.set('hour', t.start.hours).set('minute', t.start.minutes).toDate(),
										end: e.day.set('hour', t.end.hours).set('minute', t.end.minutes).toDate(),
										display: 'background'
									};
								});
							});

						if (ec !== undefined) {
							const [min, max, slotHeight] = getCalendarProperties(
								start,
								end,
								bookings.map((e) => {
									return {
										start: createTime(e.start.getHours(), e.start.getMinutes()),
										end: createTime(e.end.getHours(), e.end.getMinutes())
									};
								})
							);

							currentSlotHeight = slotHeight;
							ec.setOption('slotMinTime', min);
							ec.setOption('slotMaxTime', max);
							ec.setOption('slotHeight', slotHeight);
						}

						successCallback([...bookings, ...calendarEvents, ...unavailability]);
					}
				}
			]
		};
	});
</script>

<div class="w-full min-h-full">
	{#if options}
		<Calendar bind:this={ec} {plugins} {options} />
	{/if}
</div>

<style>
    :global(:root) {
        --ec-time-height: 50px;
    }

    :global(.ec-time-grid .ec-time),
    :global(.ec-time-grid .ec-line) {
        height: var(--ec-time-height) !important;
    }

    :global(.ec-header > div:nth-child(1)) {
        height: 0px;
    }

    :global(.ec-days) {
        height: fit-content;
    }

    :global(.ec-header .ec-day) {
        padding: 0.25em;
    }
</style>