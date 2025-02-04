import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { Database } from '../_shared/database.types.ts';
import type { Event } from 'npm:@microsoft/microsoft-graph-types';
import add_events from '../_shared/outlook/add_events.ts';

serve(async (req: Request) => {
	try {
		const { id } = await req.json();

		if (!id) {
			throw new Error('User ID not provided', { cause: 400 });
		}

		const authHeader = req.headers.get('Authorization')!;
		const supabaseClient = createClient<Database>(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			{ global: { headers: { Authorization: authHeader } } }
		);

		await supabaseClient.from('calendar_event').delete().eq('user_id', id);

		const { data: userData } = await supabaseClient
			.from('user')
			.select('ms_provider_token')
			.eq('user_id', id)
			.single();

		if (!userData) {
			throw new Error("Unable to fetch user's information", { cause: 500 });
		}

		const { data: pageData } = await supabaseClient
			.from('booking_page')
			.select('maximum_lead')
			.eq('user_id', id)
			.single();

		if (!pageData) {
			throw new Error("Unable to fetch user's page", { cause: 500 });
		}

		const start = new Date();
		const end = new Date();

		start.setHours(0, 0, 0, 0);
		end.setMinutes(end.getMinutes() + pageData.maximum_lead + 43830);

		const res = await fetch(
			`https://graph.microsoft.com/v1.0/me/calendarview/delta?startdatetime=${start.toISOString()}&enddatetime=${end.toISOString()}`,
			{
				method: 'GET',
				headers: {
					Authorization: userData.ms_provider_token || ''
				}
			}
		);

		if (!res.ok) {
			await supabaseClient.from('user').update({ ms_provider_token: null }).eq('user_id', id);

			throw new Error('Unable to access Microsoft Graph API');
		}

		const data = await res.json();

		end.setDate(end.getDate() - 1);

		const { error: deltaError } = await supabaseClient
			.from('user')
			.update({
				delta_link: data['@odata.deltaLink'],
				delta_expiry: end.toISOString()
			})
			.eq('user_id', id);

		if (deltaError) {
			throw new Error('Unable to retrieve delta link', { cause: 500 });
		}

		const addedCount = await add_events(supabaseClient, id, data.value as Event[]);

		return new Response(JSON.stringify(`${addedCount} calendar events added`), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), {
			status: e.cause ? e.cause : 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
});
