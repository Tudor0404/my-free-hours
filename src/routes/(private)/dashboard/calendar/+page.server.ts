import { error } from '@sveltejs/kit';

export const ssr = false;

export async function load({ locals: { supabase }, depends }) {
	const { data: bookings } = await supabase.from('bookings_with_duration').select('*');

	depends('supabase:db:booking_calendar');

	if (bookings === null) {
		return error(400, "Unable to fetch the hosts's bookings");
	}

	const { data: schedules } = await supabase.from('active_page_schedules').select('*').single();

	if (schedules === null) {
		return error(400, 'Unable to get used schedules');
	}

	const { data: booking_types } = await supabase.from('booking_type').select('*');

	if (booking_types === null) {
		return error(400, 'Unable to get booking types');
	}

	const { data: calendar_events } = await supabase.from('calendar_event').select('*');

	if (calendar_events === null) {
		return error(400, 'Unable to get calendar events');
	}

	return {
		bookings,
		schedules,
		booking_types,
		calendar_events
	};
}
