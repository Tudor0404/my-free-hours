import { blacklistDays } from "$lib/schemas/blacklistDays.js";
import { user } from "$lib/schemas/user.js";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load = async ({ locals: { supabase }, depends }) => {
	const { data: userData } = await supabase.from("user").select("*").limit(1)
		.single();

	const { data: blacklistDaysData } = await supabase.from("blacklisted_days")
		.select("date");

	const { data: icsLink } = await supabase.from("booking_page").select(
		"calendar_id",
	).single();

	const nameForm = await superValidate(userData, zod(user));

	depends("supabase:auth:identities");
	depends("supabase:db:blacklistdays");

	const blacklistForm = await superValidate(
		blacklistDaysData
			? { days: blacklistDaysData.map((item) => item.date) }
			: null,
		zod(blacklistDays),
	);

	const {
		data: identities,
	} = await supabase.auth.getUserIdentities();

	return {
		nameForm,
		blacklistForm,
		identities: identities,
		calendar_id: icsLink?.calendar_id,
	};
};

export const actions = {
	updateUser: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate(request, zod(user));

		if (!session) {
			return fail(400, { message: "Unable to fetch user" });
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const { status } = await supabase.from("user").update(form.data).eq(
			"user_id",
			session.user.id,
		);

		if (status !== 204) {
			return fail(500, { message: "Unable to user display display name" });
		}

		return { form };
	},
	updateBlacklistDays: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(blacklistDays));

		const { data: currentDaysData, error: currentDaysError } = await supabase
			.from(
				"blacklisted_days",
			).select("date");

		if (currentDaysError || !currentDaysData) {
			setError(form, "days._errors", "Unable to get existing blacklisted days");
			return fail(400, { form });
		}

		const existingDays = currentDaysData.map((e) => e.date);

		console.log(form.data);

		const toRemove = existingDays.filter((item) =>
			!form.data.days.includes(item)
		);
		const toAdd = form.data.days.filter((item) => !existingDays.includes(item));

		const { error: RpcError } = await supabase.rpc("update_blacklisted_dates", {
			p_dates_to_delete: toRemove,
			p_dates_to_insert: toAdd,
			p_delete_meetings: form.data.deleteMeetings,
		});

		if (RpcError) {
			console.log(RpcError);
			setError(form, "days._errors", "Unable to get update blacklisted days");
			return fail(400, { form });
		}

		return { form };
	},
};
