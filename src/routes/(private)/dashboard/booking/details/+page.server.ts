import { createDetails } from '$lib/schemas/bookingDetails';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(createDetails));

	return { form };
};

export const actions = {};
