import { user } from '$lib/schemas/user.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals: { supabase } }) => {
	const { data: formData } = await supabase.from('user').select('*').limit(1).single();

	const form = await superValidate(formData, zod(user));

	return {
		form
	};
};

export const actions = {
	updateUser: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate(request, zod(user));

		if (!session) {
			return fail(400, { message: 'Unable to fetch user' });
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const { status } = await supabase.from('user').update(form.data).eq('user_id', session.user.id);

		if (status !== 204) {
			return fail(500, { message: 'Unable to user display display name' });
		}

		return { form };
	}
};
