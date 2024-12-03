import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase } }) {
	const { data, error: sError } = await supabase
		.rpc('delete_booking', { url_id_input: params.id })
		.single();

	if (sError || !data.url_id) {
		return error(400, 'Unable to delete booking');
	}

	return new Response('Booking deleted successfully', { status: 200 });
}
