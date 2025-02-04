import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { Database } from '../database.types.ts';
import type { Event } from 'npm:@microsoft/microsoft-graph-types';

// https://learn.microsoft.com/en-us/graph/api/resources/event?view=graph-rest-1.0

export default async function add_events(
	supabaseClient: SupabaseClient<Database>,
	user_id: string,
	events: Event[]
): Promise<number> {
	let buffer: Database['public']['Tables']['calendar_event']['Row'][] = [];

	for (let i = 0; i < events.length; i++) {
		const event = events[i];

		const id = event['iCalUId'];
		const start = event['start'];
		const end = event['end'];
		const transactionId =
			event['transactionId'] && event['transactionId'].startsWith('MyFreeHours:')
				? event['transactionId'].replace('MyFreeHours:', '')
				: null;

		if (!id || !start || !end || !start.dateTime || !end.dateTime) {
			continue;
		}

		const duration = Math.floor(
			Math.abs(new Date(end.dateTime).getTime() - new Date(start.dateTime).getTime()) / (1000 * 60)
		);

		buffer.push({
			booking_url: transactionId,
			id: id,
			start_time: start.dateTime,
			user_id: user_id,
			duration: duration
		});
	}

	const { data, error } = await supabaseClient.from('calendar_event').insert(buffer);

	return buffer.length;
}
