import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { createType } from '$lib/schemas/bookingTypes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, session }, depends }) => {
	depends('supabase:db:booking_type');

	const form = await superValidate(zod(createType));

	const { data } = await supabase.from('booking_type').select('*');

	return {
		session,
		form
	};
};

export const actions = {
	createType: async ({ request, locals: { supabase, session } }) => {
		// Validate the form data
		const form = await superValidate(request, zod(createType));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (session?.user.id == undefined) {
			return error(401, { message: 'User session unable to be retrieved' });
		}

		try {
			const { data, error: supabaseError } = await supabase.rpc(
				'create_booking_type_with_durations',
				{
					type_data: {
						name: form.data.name,
						description: form.data.description || null,
						online: form.data.online,
						in_person: form.data.in_person,
						pre_notification: form.data.pre_notification || null,
						post_notification: form.data.post_notification || null,
						durations: form.data.durations
					},
					user_id: session.user.id
				}
			);

			if (supabaseError) {
				if (supabaseError.code === '23505') {
					setError(form, 'name', 'Booking names must be unique');
				} else {
					return error(400, { message: 'Malformed request' });
				}
				return fail(400, { form });
			}

			return {
				form,
				data
			};
		} catch (error) {
			setError(form, 'description', 'Failed to create booking type');
			return fail(500, { form });
		}
	}
};
