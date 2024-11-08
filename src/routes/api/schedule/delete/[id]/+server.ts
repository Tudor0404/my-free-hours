import { invalidate } from '$app/navigation';

export async function DELETE({ params, locals: { supabase } }) {
	const { error } = await supabase.from('schedule').delete().eq('id', params.id);

	if (error) {
		if (error.code == '23503') {
			return new Response('Schedule cannot be deleted because it is used by a page', {
				status: 405
			});
		}

		return new Response('Unable to delete schedule', { status: 405 });
	}

	return new Response('Deleted schedule successfully', {
		status: 200
	});
}
