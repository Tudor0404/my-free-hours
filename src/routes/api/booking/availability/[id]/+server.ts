import Schedule from '$lib/schedule/Schedule.js';
import { json } from '$lib/utils/json';
import { absoluteTimeToObject } from '$lib/utils/time.js';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';

export async function GET({ params, locals: { supabase } }) {
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

	return json({
		onlineSlots: onlineSlots,
		inpersonSlots: inpersonSlots,
		requiresEmail: data.requires_email,
		meetingTypes: data.booking_types
	});
}
