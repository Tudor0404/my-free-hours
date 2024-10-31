import Schedule from '$lib/schedule/Schedule.js';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z.object({
	name: z.string(),
	description: z
		.string()
		.max(1000, 'Descriptions cannot be more than 1000 characters in length')
		.optional(),
	schedule: z.string()
});

export const load: PageServerLoad = async ({ locals: { supabase, session }, depends }) => {
	const form = await superValidate(zod(schema));

	depends('supabase:db:schedule');

	const { data: schedules } = await supabase.from('schedule').select('*');

	return {
		schedules,
		session,
		form
	};
};

export const actions = {
	createSchedule: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let schedule = Schedule.decode_json(JSON.parse(form.data.schedule));

		try {
			schedule.verify();
		} catch (_e) {
			const e: Error = _e as Error;
			setError(form, 'schedule', e.message);

			return fail(400, { form });
		}

		const { error } = await supabase.from('schedule').insert(form.data);

		if (error) {
			if (error?.code == '23505') {
				setError(form, 'name', 'Booking names must be unique');
			} else {
				setError(form, 'schedule', 'Unexpected error occured');
			}

			return fail(500, { form });
		}

		return { form };
	}
};
