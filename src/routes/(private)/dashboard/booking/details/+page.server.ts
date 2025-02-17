import { createDetails } from '$lib/schemas/bookingDetails';
import { error } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals: { supabase }, url }) => {
	const { data: page } = await supabase.from('booking_page').select('*').limit(1).single();
	const { data: schedules } = await supabase.from('schedule').select('*');

	if (!page) {
		error(400, { message: 'Unable to fetch user booking page' });
	}

	const form = await superValidate(page, zod(createDetails));

	return { form, urlId: page.url_id, schedules, origin: url.origin };
};

export const actions = {
	updateDetails: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate(request, zod(createDetails));
		
		if (!session) {
			return fail(400, { message: 'Unable to fetch user' });
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const { status } = await supabase
			.from('booking_page')
			.update(form.data)
			.eq('user_id', session.user.id);

		if (status !== 204) {
			return fail(500, { message: 'Unable to update booking page' });
		}

		return { form };
	}
};
