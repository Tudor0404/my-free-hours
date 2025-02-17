import { generateCalendar } from '$lib/utils/calendar/create-events.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals: { supabase }, params, url }) {
	if (!params.id) {
		error(400, 'ID not provided');
	}

	try {
		const { data: bookings, error } = await supabase.rpc('get_bookings_by_calendar_id', {
			p_calendar_id: params.id
		});

		if (error) throw error;

		const calendarContent = await generateCalendar(bookings, url.origin);

		return new Response(calendarContent, {
			headers: {
				'Content-Type': 'text/calendar',
				'Content-Disposition': 'attachment; filename="calendar.ics"'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to generate calendar' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
