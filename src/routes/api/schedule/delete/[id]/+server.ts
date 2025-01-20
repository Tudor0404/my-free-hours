import { error } from "@sveltejs/kit";

export async function DELETE({ params, locals: { supabase } }) {
	const { error: sError, data } = await supabase
		.from("schedule")
		.delete()
		.eq("id", params.id)
		.select("id");

	if (sError || data.length == 0) {
		if (sError && sError.code == "23503") {
			// used by a schedule
			const { data: referencedData, error: referencedError } = await supabase
				.from("schedule_references").select("*").eq("referenced_id", params.id);

			if (referencedError || referencedData === null) {
				error(
					500,
					"Unable to retrieve referenced schedule table, to check for deletion anomalies",
				);
			}

			if (referencedData.length > 0) {
				const { data: referencedScheduleData, error: referencedScheduleError } =
					await supabase.from("schedule").select("name").eq(
						"id",
						referencedData[0].source_id,
					).single();

				if (referencedScheduleData === null || referencedScheduleError) {
					error(
						500,
						"Unable to fetch information about the referenced schedule that prevents deletion",
					);
				}

				error(
					400,
					`Unable to delete schedule as it referenced by at least one other schedule (${referencedScheduleData.name})`,
				);
			}

			// used by a page
			error(405, "Schedule cannot be deleted because it is used by a page");
		}

		error(405, "Unable to delete schedule");
	}

	return new Response("Deleted schedule successfully", {
		status: 200,
	});
}
