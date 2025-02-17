import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/');
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/dashboard');
		}
	},
	loginMicrosoft: async ({ request, locals: { supabase }, url }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'azure',
			options: {
				scopes: 'email offline_access',
				redirectTo: url.origin + '/auth/callback'
			}
		});

		if (error) {
			console.error('Azure OAuth Login Error:', error);
			throw redirect(303, '/auth/error');
		}

		if (data?.url) {
			// Redirect the user to the Azure OAuth consent screen
			redirect(303, data.url);
		}
	}
};
