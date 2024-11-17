import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase } }) {
	const { error: sError } = await supabase.from('booking_type').delete().eq('id', params.id);

	if (sError) {
		error(405, 'Unable to delete meeting type');
	}

	return new Response('Deleted meeting type successfully', {
		status: 200
	});
}
