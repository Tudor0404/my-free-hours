export async function load({ params, locals: { supabase } }) {
	const { data: schedule } = await supabase
		.from('schedule')
		.select('*')
		.eq('id', params.id)
		.single();

	return {
		schedule
	};
}
