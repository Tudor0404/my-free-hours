import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z
	.object({
		name: z.string(),
		description: z
			.string()
			.max(1000, 'Descriptions cannot be more than 1000 characters in length')
			.optional(),
		online: z.boolean().default(true),
		in_person: z.boolean().default(true),
		pre_notification: z
			.string()
			.max(1000, 'Notification messages cannot be more than 1000 characters in length')
			.optional(),
		post_notification: z
			.string()
			.max(1000, 'Notification messages cannot be more than 1000 characters in length')
			.optional()
	})
	.refine((data) => data.online || data.in_person, {
		message: 'A meeting must be able to be held at least in person or online',
		path: ['online']
	});

export const load: PageServerLoad = async ({ locals: { supabase, session }, depends }) => {
	depends('supabase:db:booking_type');

	const form = await superValidate(zod(schema));

	const { data } = await supabase.from('booking_type').select('*');

	return {
		session,
		form
	};
};

export const actions = {
	createType: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.from('booking_type').insert(form.data);

		if (error) {
			if (error?.code == '23505') {
				setError(form, 'name', 'Booking names must be unique');
			} else {
				setError(form, 'description', 'Unexpected error occured');
			}
		}

		if (error) {
			return fail(400, { form });
		}

		return { form };
	}
};
