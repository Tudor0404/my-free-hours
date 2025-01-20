import Schedule from "$lib/schedule/Schedule.js";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { CreateSchedule, DeleteSchedule } from "$lib/schemas/schedule";
import { schedulesStore } from "$lib/stores/schedules";

export const load: PageServerLoad = async (
	{ locals: { supabase, session }, depends },
) => {
	const form = await superValidate(zod(CreateSchedule));

	depends("supabase:db:schedule");

	const { data: schedules } = await supabase
		.from("schedule")
		.select("*")
		.order("created_at", { ascending: false });

	return {
		schedules,
		session,
		form,
	};
};

export const actions = {
	createSchedule: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(CreateSchedule));

		if (!form.valid) {
			return fail(400, { form });
		}

		let schedule = Schedule.decode_json(JSON.parse(form.data.schedule));

		const { data: schedulesData, error: schedulesError } = await supabase.from(
			"schedule",
		).select("*");

		if (schedulesError) {
			setError(form, "schedule", "Unable to fetch other schedules");
		}

		try {
			schedule.verify();
		} catch (_e) {
			const e: Error = _e as Error;
			setError(form, "schedule", e.message);

			return fail(400, { form });
		}

		const { error } = await supabase.from("schedule").insert(form.data);

		if (error) {
			if (error?.code == "23505") {
				setError(form, "name", "Booking names must be unique");
			} else {
				setError(form, "schedule", "Unexpected error occured");
			}

			return fail(500, { form });
		}

		return { form };
	},
	// deleteSchedule: async ({ request, locals: { supabase } }) => {
	// 	const form = await superValidate(request, zod(DeleteSchedule));

	// 	if (!form.valid) {
	// 		return fail(400, { form });
	// 	}

	// 	const { error } = await supabase.from("schedule").delete().eq(
	// 		"id",
	// 		form.id,
	// 	);

	// 	if (error) {
	// 		setError(form, "id", "Unable to delete form");
	// 		return fail(500, { form });
	// 	}

	// 	return { form };
	// },
};
