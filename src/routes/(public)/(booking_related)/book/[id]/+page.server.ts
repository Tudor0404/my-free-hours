import Schedule from '$lib/schedule/Schedule.js';
import { booking } from '$lib/schemas/booking';
import { absoluteTimeToObject, createTime, timeOp } from '$lib/utils/time.js';
import type { BookingTypePublic } from '$types/BookingTypePublic.js';
import { error, redirect } from '@sveltejs/kit';
import dayjs, { type Dayjs } from 'dayjs';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load({ params, locals: { supabase } }) {
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

	const form = await superValidate(zod(booking));

	return {
		onlineSlots: onlineSlots,
		inpersonSlots: inpersonSlots,
		requiresEmail: data.requires_email,
		meetingTypes: data.booking_types as BookingTypePublic[],
		display_name: data.display_name,
		form
	};
}

export const actions = {
	createBooking: async ({ request, locals: { supabase, session }, params }) => {
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

		// time and date
		if (form.data.meeting_method == 'in_person') {
			const inpersonSchedule = Schedule.decode_json(
				JSON.parse((bookingDetails.inperson_schedule as string).toString())
			);

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
			console.log(bookingError, urlID);
			setError(form, 'time', 'Unable to create meeting');
			return fail(500, { form });
		}

		redirect(304, '/booking/' + urlID);
	}
};
