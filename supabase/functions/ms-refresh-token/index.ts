import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Database } from '../_shared/database.types.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

serve(async (req: Request) => {
	try {
		const { id } = await req.json();

		if (!id) {
			throw new Error('user id not provided', { cause: 400 });
		}

		const authHeader = req.headers.get('Authorization')!;
		const supabaseClient = createClient<Database>(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			{ global: { headers: { Authorization: authHeader } } }
		);

		const { data: userData, error: userError } = await supabaseClient
			.from('user')
			.select('ms_provider_refresh_token')
			.eq('user_id', id)
			.single();

		if (userError || !userData.ms_provider_refresh_token) {
			throw new Error('Unable to get provider refresh token', { cause: 500 });
		}

		const res = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: Deno.env.get('MS_CLIENT_ID') || '',
				scope: 'https://graph.microsoft.com/.default',
				grant_type: 'refresh_token',
				refresh_token: userData.ms_provider_refresh_token,
				client_secret: Deno.env.get('MS_CLIENT_SECRET') || ''
			})
		});

		const data = await res.json();

		if (res.status === 400) {
			await supabaseClient
				.from('user')
				.update({ ms_provider_refresh_token: null })
				.eq('user_id', id);
			throw new Error('Invalid refresh token', { cause: 400 });
		} else if (!res.ok || !data.access_token) {
			throw new Error('Could not retrieve token', { cause: 500 });
		}

		const { error } = await supabaseClient
			.from('user')
			.update({ ms_provider_token: data.access_token })
			.eq('user_id', id);

		if (error) {
			throw new Error('Unable to save new token', { cause: 500 });
		}

		return new Response(JSON.stringify({ message: 'Successfully created new access token' }), {
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
