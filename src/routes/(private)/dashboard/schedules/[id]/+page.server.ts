export async function load({ params, locals: { supabase }, url }) {
	const { data: schedule } = await supabase
		.from('schedule')
		.select('*')
		.eq('id', params.id)
		.single();

	return {
		schedule
	};
}
