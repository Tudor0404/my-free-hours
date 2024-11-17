import { error } from '@sveltejs/kit';

export async function PATCH({ params, locals: { supabase }, url }) {
	const checked = url.searchParams.get('checked');

	if (checked === null || !(checked === 'true' || checked === 'false')) {
		error(400, 'Improper paramters passed');
	}

	const { data, error: sError } = await supabase
		.from('booking_type')
		.update({ active: checked === 'true' })
		.eq('id', params.id);

	if (sError) {
		error(405, 'Unable to update booking type');
	}

	console.log(data);

	return new Response('Booking type updated successfully', { status: 200 });
}
