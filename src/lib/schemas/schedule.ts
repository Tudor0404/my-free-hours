import { z } from "zod";

export const CreateEditSchedule = z.object({
	id: z.number().min(0).nullable(),
	name: z
		.string()
		.min(3, "The name must be at least 3 characters long")
		.max(40, "The name must be at most 40 characters long"),
	description: z
		.string()
		.max(1000, "Descriptions cannot be more than 1000 characters in length")
		.optional(),
	schedule: z.string(),
});

export const DeleteSchedule = z.object({
	id: z.number().min(0),
});
