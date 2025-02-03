export async function load({ params, locals: { supabase }, url }) {
	const { data: schedule } = await supabase
		.from("schedule")
		.select("*")
		.eq("id", params.id)
		.single();

	console.log(JSON.stringify(await supabase.auth.getSession(), undefined, 2));

	return {
		schedule,
	};
}
