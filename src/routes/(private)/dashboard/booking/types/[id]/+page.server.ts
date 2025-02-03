export async function load({ params, locals: { supabase } }) {
	const { data: type } = await supabase
		.from("booking_types_with_durations")
		.select("*")
		.eq("id", params.id)
		.single();

	return {
		type,
	};
}
