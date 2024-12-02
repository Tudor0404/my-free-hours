import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase }, params }) {
	const { data, error: sError } = await supabase
		.rpc('get_booking', { url_id_input: params.id })
		.single();

	if (!data || sError) {
		console.log(sError);
		error(400, 'Unable to get booking');
	}

	return { bookingInfo: data, urlID: params.id };
}
