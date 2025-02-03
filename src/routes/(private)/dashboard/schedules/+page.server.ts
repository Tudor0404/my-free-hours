import Schedule from "$lib/schedule/Schedule.js";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { CreateEditSchedule } from "$lib/schemas/schedule";

export const load: PageServerLoad = async (
	{ locals: { supabase, session }, depends },
) => {
	const form = await superValidate(zod(CreateEditSchedule));

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
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(CreateEditSchedule));
		if (!form.valid) {
			return fail(400, { form });
		}

		let schedule = Schedule.decode_json(JSON.parse(form.data.schedule));
		try {
			schedule.verify();
		} catch (_e) {
			const e: Error = _e as Error;
			setError(form, "schedule", e.message);
			return fail(400, { form });
		}

		// Determine if this is an update or create operation
		if (form.data.id) {
			const { error } = await supabase
				.from("schedule")
				.update({
					name: form.data.name,
					description: form.data.description,
					schedule: form.data.schedule,
				})
				.eq("id", form.data.id);

			if (error) {
				console.log(error);
				if (error?.code == "23505") {
					setError(form, "name", "Schedule names must be unique");
				} else if (error?.code == "P0001") {
					setError(form, "schedule", error.message);
				} else {
					setError(form, "schedule", "Unexpected error occurred");
				}
				return fail(500, { form });
			}
		} else {
			const { error } = await supabase
				.from("schedule")
				.insert({
					name: form.data.name,
					schedule: form.data.schedule,
					description: form.data.description,
				});

			if (error) {
				console.log(error);
				if (error?.code == "23505") {
					setError(form, "name", "Schedule names must be unique");
				} else if (error?.code == "P0001") {
					setError(form, "schedule", error.message);
				} else {
					setError(form, "schedule", "Unexpected error occurred");
				}
				return fail(500, { form });
			}
		}

		return { form };
	},
};
