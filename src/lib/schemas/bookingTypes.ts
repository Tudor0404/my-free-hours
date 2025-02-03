import { z } from "zod";

export const createEditType = z
	.object({
		id: z.number().min(0).nullable(),
		name: z.string().max(40, "Maximum 40 characters"),
		description: z
			.string()
			.max(1000, "Descriptions cannot be more than 1000 characters in length")
			.nullable(),
		online: z.boolean().default(true),
		in_person: z.boolean().default(true),
		pre_notification: z
			.string()
			.max(
				1000,
				"Notification messages cannot be more than 1000 characters in length",
			)
			.nullable(),
		post_notification: z
			.string()
			.max(
				1000,
				"Notification messages cannot be more than 1000 characters in length",
			)
			.nullable(),
		durations: z.preprocess(
			(val) => {
				if (!val) return [];

				if (typeof val === "string") {
					return val.split(",").map((e) => Number.parseInt(e));
				}

				if (
					Array.isArray(val) && val.every((item) => typeof item === "number")
				) {
					return val;
				}

				if (Array.isArray(val)) {
					return val.map((item) => {
						const num = Number.parseInt(item);
						return isNaN(num) ? 0 : num;
					});
				}

				return [];
			},
			z
				.array(
					z
						.number()
						.min(1, "The minimum duration is 1 minute")
						.max(120, "The maximum duration is 120 minutes"),
				)
				.min(1, "Meeting must have at least one available duration")
				.max(3, "Meetings must have at most 3 available durations"),
		),
	})
	.refine((data) => data.online || data.in_person, {
		message: "A meeting must be able to be held at least in person or online",
		path: ["online"],
	})
	.refine(
		(data) => {
			const durations = data.durations;
			const uniqueDurations = new Set(durations);
			return uniqueDurations.size === durations.length;
		},
		{
			message: "All durations must be unique",
			path: ["durations"],
		},
	);
