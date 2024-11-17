import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase } }) {
	const { error: sError } = await supabase.from('schedule').delete().eq('id', params.id);

	if (sError) {
		if (sError.code == '23503') {
			error(405, 'Schedule cannot be deleted because it is used by a page');
		}

		error(405, 'Unable to delete schedule');
	}

	return new Response('Deleted schedule successfully', {
		status: 200
	});
}
