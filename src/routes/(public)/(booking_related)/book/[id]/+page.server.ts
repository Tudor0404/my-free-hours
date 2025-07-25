import Schedule from '$lib/schedule/Schedule.js';
import { booking } from '$lib/schemas/booking';
import { schedulesStore } from '$lib/stores/schedules.js';
import { absoluteTimeToObject, createTime, timeOp } from '$lib/utils/time.js';
import type { BookingTypePublic } from '$types/BookingTypePublic.js';
import { error, redirect } from '@sveltejs/kit';
import dayjs, { type Dayjs } from 'dayjs';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Event } from '@microsoft/microsoft-graph-types';
import { SERVICE_TOKEN } from '$env/static/private';

export async function load({ params, locals: { supabase } }) {
	const { data: schedules } = await supabase.from('schedule').select('*');
	schedulesStore.setFromArray(schedules || []);

	console.log(params);

	const { error: sError, data } = await supabase
		.rpc('get_booking_page_details', {
			url_id_input: params.id
		})
		.single();

	if (sError) {
		error(405, 'Unable to get booking page');
	}

	const inpersonSchedule = Schedule.decode_json(
		JSON.parse((data.inperson_schedule as string).toString())
	);
	const onlineSchedule = Schedule.decode_json(
		JSON.parse((data.online_schedule as string).toString())
	);

	const blacklistedDays = data.blacklisted_dates.map((e) => dayjs(e)).filter((e) => e.isValid());

	const bookedSlots = (data.booked_slots as { start: string; end: string }[])
		.concat(
			data.calendar_events as {
				start: string;
				end: string;
			}[]
		)
		.map((e) => ({
			start: dayjs(e.start),
			end: dayjs(e.end)
		}));

	inpersonSchedule.set_restrictions(blacklistedDays, bookedSlots);
	onlineSchedule.set_restrictions(blacklistedDays, bookedSlots);

	const inpersonSlots = inpersonSchedule.get_time_slots_within(
		dayjs().add(data.minimum_lead, 'minutes'),
		dayjs().add(data.maximum_lead, 'minutes'),
		absoluteTimeToObject(data.time_increment)
	);

	const onlineSlots = onlineSchedule.get_time_slots_within(
		dayjs().add(data.minimum_lead, 'minutes'),
		dayjs().add(data.maximum_lead, 'minutes'),
		absoluteTimeToObject(data.time_increment)
	);

	if (!data.booking_types || (data.booking_types as BookingTypePublic[]).length === 0) {
		throw new Error('No booking type found.');
	}
	// @ts-ignore
	const form = await superValidate(zod(booking), {
		defaults: {
			type_id: (data.booking_types as BookingTypePublic[])[0].id,
			meeting_method: (data.booking_types as BookingTypePublic[])[0].in_person
				? 'in_person'
				: 'online'
		}
	});

	return {
		onlineSlots: onlineSlots,
		inpersonSlots: inpersonSlots,
		requiresEmail: data.requires_email,
		meetingTypes: (data.booking_types || []) as BookingTypePublic[],
		display_name: data.display_name,
		form
	};
}

export const actions = {
	createBooking: async ({ request, locals: { supabase, user }, params }) => {
		const form = await superValidate(request, zod(booking));

		if (!form.valid) {
			return fail(400, { form });
		}

		// validate booking
		const { error: sError, data: bookingDetails } = await supabase
			.rpc('get_booking_page_details', {
				url_id_input: params.id
			})
			.single();

		if (sError) {
			return fail(400, { form });
		}

		const selectedType = (bookingDetails.booking_types as BookingTypePublic[]).find(
			(e) => e.id == form.data.type_id
		);

		// meeting type not found
		if (!selectedType) {
			setError(form, 'type_id', 'Unable to find selected meeting type');
			return fail(500, { form });
		}

		// meeting methods
		if (!selectedType.in_person && form.data.meeting_method == 'in_person') {
			setError(form, 'meeting_method', 'Selected meeting type does not allow in person meetings');
			return fail(500, { form });
		}

		if (!selectedType.online && form.data.meeting_method == 'online') {
			setError(form, 'meeting_method', 'Selected meeting type does not allow online meetings');
			return fail(500, { form });
		}

		// duration
		if (selectedType.durations.indexOf(form.data.duration) === -1) {
			setError(form, 'duration', 'Selected duration is not available for this meeting type');
			return fail(500, { form });
		}

		// requires email
		if (!form.data.guest_email && bookingDetails.requires_email) {
			setError(form, 'guest_email', 'An mail address is required');
			return fail(500, { form });
		}

		// check email format
		if (
			form.data.guest_email &&
			!form.data.guest_email
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
		) {
			setError(form, 'guest_email', 'Email is not valid');
			return fail(500, { form });
		}

		// email domain
		if (bookingDetails.required_email_domains && form.data.guest_email) {
			const domains = bookingDetails.required_email_domains.split(',').map((e) => e.trim());

			if (domains.findIndex((e) => form.data.guest_email?.endsWith(e)) === -1) {
				setError(form, 'guest_email', 'This email domain is not allowed');
				return fail(500, { form });
			}
		}

		let startTime: Dayjs;

		const blacklistedDays = bookingDetails.blacklisted_dates
			.map((e) => dayjs(e))
			.filter((e) => e.isValid());

		const bookedSlots = (
			bookingDetails.booked_slots as {
				start: string;
				end: string;
			}[]
		)
			.concat(bookingDetails.calendar_events as { start: string; end: string }[])
			.map((e) => ({
				start: dayjs(e.start),
				end: dayjs(e.end)
			}));

		// time and date
		if (form.data.meeting_method == 'in_person') {
			const inpersonSchedule = Schedule.decode_json(
				JSON.parse((bookingDetails.inperson_schedule as string).toString())
			);

			inpersonSchedule.set_restrictions(blacklistedDays, bookedSlots);

			const inpersonSlots = inpersonSchedule.get_time_slots_within(
				dayjs().add(bookingDetails.minimum_lead, 'minutes'),
				dayjs().add(bookingDetails.maximum_lead, 'minutes'),
				absoluteTimeToObject(bookingDetails.time_increment)
			);

			const dayIndex = inpersonSlots
				.map((e) => dayjs(e.day).format('YYYY-MM-DD'))
				.indexOf(form.data.date);

			if (dayIndex == -1) {
				setError(form, 'date', 'Invalid date selected');
				return fail(500, { form });
			}

			const [hoursString, minutesString] = form.data.time.split(':');
			const time = createTime(Number.parseInt(hoursString), Number.parseInt(minutesString));

			if (inpersonSlots[dayIndex].times.findIndex((e) => timeOp(e.start, '=', time)) === -1) {
				setError(form, 'time', 'Selected time is not valid');
				return fail(500, { form });
			}

			startTime = dayjs(form.data.date)
				.startOf('day')
				.set('hour', time.hours)
				.set('minute', time.minutes);
		} else {
			const onlineSchedule = Schedule.decode_json(
				JSON.parse((bookingDetails.online_schedule as string).toString())
			);

			onlineSchedule.set_restrictions(blacklistedDays, bookedSlots);

			const onlineSlots = onlineSchedule.get_time_slots_within(
				dayjs().add(bookingDetails.minimum_lead, 'minutes'),
				dayjs().add(bookingDetails.maximum_lead, 'minutes'),
				absoluteTimeToObject(bookingDetails.time_increment)
			);

			const dayIndex = onlineSlots
				.map((e) => dayjs(e.day).format('YYYY-MM-DD'))
				.indexOf(form.data.date);

			if (dayIndex == -1) {
				setError(form, 'date', 'Invalid date selected');
				return fail(500, { form });
			}

			const [hoursString, minutesString] = form.data.time.split(':');
			const time = createTime(Number.parseInt(hoursString), Number.parseInt(minutesString));

			if (onlineSlots[dayIndex].times.findIndex((e) => timeOp(e.start, '=', time)) === -1) {
				setError(form, 'time', 'Selected time is not valid');
				return fail(500, { form });
			}

			startTime = dayjs(form.data.date)
				.startOf('day')
				.set('hour', time.hours)
				.set('minute', time.minutes);
		}

		const { data: durationID } = await supabase
			.from('duration')
			.select('id')
			.match({ type_id: selectedType.id, duration: form.data.duration })
			.single();

		if (durationID === null) {
			setError(form, 'duration', 'Unable to locate duration');
			return fail(500, { form });
		}

		// Parse the requested time
		const [hoursString, minutesString] = form.data.time.split(':');
		startTime = dayjs(form.data.date)
			.startOf('day')
			.set('hour', parseInt(hoursString))
			.set('minute', parseInt(minutesString));

		// Calculate end time based on selected duration
		const endTime = startTime.add(form.data.duration, 'minutes');

		// Check for overlapping bookings
		const { data: existingBookings, error: bookingsError } = await supabase
			.from('booking')
			.select(
				`
        *,
        duration!inner (
          duration
        )
      `
			)
			.eq('page_id', bookingDetails.id)
			.eq('meeting_method', form.data.meeting_method)
			.gte('start_time', startTime.startOf('day').toISOString())
			.lte('start_time', startTime.endOf('day').toISOString());

		if (bookingsError) {
			setError(form, 'time', 'Unable to verify time slot availability');
			return fail(500, { form });
		}

		// Check for overlaps
		const hasOverlap = existingBookings.some((booking) => {
			// Ensure both booking.duration and booking.duration.duration exist
			if (!booking.duration?.duration) {
				return false; // Skip this booking if duration is missing
			}

			const bookingStart = dayjs(booking.start_time);
			const bookingEnd = bookingStart.add(booking.duration.duration, 'minutes');

			// Check if the new booking overlaps with existing booking
			// Allow bookings to start exactly when another ends
			const overlaps =
				startTime.isBefore(bookingEnd) &&
				endTime.isAfter(bookingStart) &&
				!startTime.isSame(bookingEnd) &&
				!endTime.isSame(bookingStart);

			return overlaps;
		});

		if (hasOverlap) {
			setError(form, 'time', 'This time slot overlaps with an existing booking');
			return fail(500, { form });
		}

		const { data: urlID, error: bookingError } = await supabase.rpc('create_booking', {
			p_duration_id: durationID.id,
			p_guest_email: form.data.guest_email || undefined,
			p_guest_name: form.data.guest_name,
			p_meeting_method: form.data.meeting_method,
			p_page_id: bookingDetails.id,
			p_type_id: selectedType.id,
			p_start_time: startTime.toISOString()
		});

		if (urlID === null) {
			setError(form, 'time', 'Unable to create meeting');
			return fail(500, { form });
		}

		// create online meeting
		const { error: refreshError } = await supabase
			.from('user')
			.select('*')
			.neq('ms_provider_refresh_token', null)
			.single();

		if (refreshError) {
			if (form.data.meeting_method === 'online') {
				setError(form, 'meeting_method', 'Unable to create online meeting');
				return fail(500, { form });
			}

			redirect(304, '/booking/' + urlID);
		}

		// cosnt createMeetingRes = await fetch("https://yufhojeffwwthvabyuxm.supabase.co/functions/v1/ms-create-event", {
		// 	method: "POST",
		// 	body: JSON.stringify()
		// })

		const { data: createMeetingData, error: createMeetingError } = await supabase.functions.invoke(
			'ms-create-event',
			{
				body: {
					start: startTime.toISOString(),
					end: endTime.toISOString(),
					subject: 'Meeting with ' + form.data.guest_name,
					body: `${form.data.meeting_method === 'online' ? 'Online' : 'In person'} '${selectedType.name}' meeting with ${form.data.guest_name}${form.data.guest_email ? `(${form.data.guest_email})` : ''} at ${startTime.format('MMMM D, YYYY [at] h:mm A\n')} until ${endTime.format('MMMM D, YYYY [at] h:mm A\n')} (${form.data.duration} minutes).`,
					isOnline: form.data.meeting_method === 'online',
					guestEmail: form.data.guest_email,
					guestName: form.data.guest_name,
					url_id: params.id,
					bookingUrl: urlID
				},
				headers: {
					Authorization: 'Bearer ' + SERVICE_TOKEN
				}
			}
		);

		if (createMeetingError) {
			console.log('Unable to create meeting ' + createMeetingError + createMeetingData);
			redirect(304, '/booking/' + urlID);
		}

		if (urlID) redirect(304, '/booking/' + urlID);
	}
};
