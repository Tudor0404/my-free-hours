import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { supabase } }) => {
	const { data: page } = await supabase.from('booking_page').select('*').limit(1).single();

	return { origin: url.origin, urlId: page?.url_id };
};
