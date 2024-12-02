import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase } }) {
	const { count } = await supabase
		.from('booking')
		.delete({ count: 'exact' })
		.eq('id', Number.parseInt(params.id));

	if (count === 0 || count == null) {
		return error(400, 'Unable to delete booking');
	}

	return new Response('Booking deleted successfully', { status: 200 });
}
