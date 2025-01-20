import { error, json } from "@sveltejs/kit";

export async function GET({ locals: { supabase } }) {
	const { error: sError, data } = await supabase.from("schedule").select("*");

	if (sError || data.length == 0) {
		error(405, "Unable to retrieve schedule");
	}

	return json(data, { status: 200 });
}
